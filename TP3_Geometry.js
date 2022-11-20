
class Node {
	constructor(parentNode) {
		this.parentNode = parentNode; //Noeud parent
		this.childNode = []; //Noeud enfants

		this.p0 = null; //Position de depart de la branche
		this.p1 = null; //Position finale de la branche

		this.a0 = null; //Rayon de la branche a p0
		this.a1 = null; //Rayon de la branche a p1

		this.sections = null; //Liste contenant une liste de points representant les segments circulaires du cylindre generalise
	}
}

TP3.Geometry = {

	simplifySkeleton: function (rootNode, rotationThreshold = 0.0001) {
		//TODO
		// Faire le parcours recursif des enfant d'un noeud
		// Si l'enfant n'a qu'un seul enfant et que l'agnle entre les
		// deux vecteurs est plus petits que rotationThreshold, retirer l'enfant
		// relier le petit enfant au parents et poursuivre


		if (rootNode.childNode.length == 1) {
			let c = rootNode.childNode[0];

			//make vector from point of segments
			// let v1 = rootNode.p0.sub(c.p0)
			// let v2 = c.p1.sub(c.p0)
			let v1 = new THREE.Vector3();
			let v2 = new THREE.Vector3();

			v1.subVectors(rootNode.p0,c.p0);
			v2.subVectors(c.p1,c.p0);

			let angle = this.findRotation(v1, v2);

			if (angle[1] - Math.PI < rotationThreshold){
				//node is removed
				for(let i = 0; i < c.childNode.length; i++) {
					c.childNode[i].parentNode = rootNode;
				}
				rootNode.childNode= c.childNode;
				rootNode.p1 = c.p1;
				rootNode.a1 = c.a1;

				//NULL c
				c.childNode = null;
				c.parentNode = null;
				this.simplifySkeleton(rootNode);
			} else {
				this.simplifySkeleton(c)
			}
		} else if (rootNode.childNode.length > 1) {
			for (let i = 0; i < rootNode.childNode.length; i++) {
				let ntc = rootNode.childNode[i];
				this.simplifySkeleton(ntc);
			}
			// explore tous les child nodes recursivement
		} else if (rootNode.childNode.length == 0) {
			// fini d'explorer cette branche, nous sommes à une extremité
			// et donc rien à simplifier ici
		}

		// might need to change this if ever our tree doesn't start at 0,0,0
		if (rootNode.p0 == new THREE.Vector3(0,0,0) ){
			return rootNode;
		}
	}
	,

	generateSegmentsHermite: function (rootNode, lengthDivisions = 4, radialDivisions = 8) {
		var stack = [];
		stack.push(rootNode);
		while(stack.length > 0) {
			var currentNode = stack.pop();
			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}
			var h0 = currentNode.p0;
			var h1 = currentNode.p1;
			currentNode.sections = []; // On veut une liste de sections et chaque section est constituée d'une liste de points

			var v0 = new THREE.Vector3();

			if (currentNode.parentNode != null) {
				v0.subVectors(currentNode.parentNode.p1, currentNode.parentNode.p0);
			}
			var v1 = new THREE.Vector3();
			v1.subVectors(currentNode.p1, currentNode.p0);

			// Now we need to iterate through t in order to get our segments
			for (var t = 0; t <= 1; t += 1 / (lengthDivisions - 1)) {
				const [p, vt] = this.hermite(h0, h1, v0, v1, t); // on obtient notre point interpolé de notre segment et sa tangente
				const [pDt, vtDt] = this.hermite(h0, h1, v0, v1, t + 1 / (lengthDivisions - 1));
				const [axe, angle] = this.findRotation(vt, vtDt); // Pour notre moving frame, d'abord il faut trouver la rotation entre nos tangentes v{t} et v{t+dt}
				var movingFrame = new THREE.Matrix3();
				if(axe != (0,0,0) && angle != 0) {
					movingFrame.multiplyMatrices(movingFrame, this.findRotationMatrix(axe, angle));
				}

				// La coupe transversale de notre cylindre est un cercle
				var circlePtArray = [];
				var theta = 0;
				// À t=0 les points de notre section proviennent des de son parent à t=1
				if(t == 0 && currentNode.parentNode != null && currentNode.parentNode.sections.length > 0){
					currentNode.sections = currentNode.parentNode.sections.slice(0);
					continue;
				}
				// Now generate a list of points of size radialDivisions (forming a circle)
				// For a circle, x = rcos(theta) and y = rsin(theta), we need as many points as radial divisions, so theta = 0 += pi/radialDivisions
				else {
					for (var i = 0; i < radialDivisions; i++) {
						// r needs to be interpolated from a0, a1 and our t
						var circleP = new THREE.Vector3();
						var rInter = currentNode.a1 * t + currentNode.a0 * (1 - t);
						var x = rInter * Math.cos(theta) + p.x;
						var z = rInter * Math.sin(theta) + p.z;
						circleP.set(x, p.y, z); // Les points sur notre cercle ont tous le même y que le point interpolé
						circlePtArray.push(circleP);
						theta += 2 * Math.PI / radialDivisions; // Le cercle a un radius de 2pi, donc chaque point sera séparé par un angle de 2pi / radialDivisions


						// For each radial division (i.e. point), we need to use a moving frame matrix to correctly orient each point. This is
						// done by initializing an identity matrix, calculate the matrix rotation between point v{t} and v{t+dt}, here
						// dt always = 1/4 (since lengthDivisions = 4). Once this rotation matrix is obtained, multiply the identity
						// matrix with it. Something needs to be done with our hermite tangent as well since it should transform our
						// moving frame. Finally, multiply resulting transformation matrix with our point and push it to sections.
					}
					// for(let j=0; j < circlePtArray.length; j++){
					// 	circlePtArray[j].applyMatrix3(movingFrame);
					// }
					currentNode.sections.push(circlePtArray);
				}
			}
		}
		return rootNode;
	},

	hermite: function (h0, h1, v0, v1, t) {
		// Nos points Hermite, représentés par une matrice
		var herPoints = new THREE.Matrix4();
		herPoints.set(h0.x, h0.y, h0.z, 0,
			h1.x, h1.y, h1.z, 0,
			v0.x, v0.y, v0.z, 0,
			v1.x, v1.y, v1.z, 0)

		// Matrice pour convertir d'Hermite à Bézier
		var herToBezMat = new THREE.Matrix4();
		herToBezMat.set(3, 0,0,0,
			3,0,1,0,
			0,3,0,-1,
			0,3,0,0);

		// Conversion de points Hermite à points Bézier
		var bezPoints = new THREE.Matrix4();
		bezPoints = bezPoints.multiplyMatrices(herToBezMat, herPoints);
		bezPoints = bezPoints.multiplyScalar(1/3);

		// Pour obtenir nos points de contrôle p0, p1, p2, p3, nous les extractons de notre matrice Bézier
		var p0 = new THREE.Vector3();
		var p1 = new THREE.Vector3();
		var p2 = new THREE.Vector3();
		var p3 = new THREE.Vector3();
		// Les matrices dans THREE.js sont ordonnées par colonnes
		p0.set(bezPoints.elements.at(0), bezPoints.elements.at(4), bezPoints.elements.at(8));
		p1.set(bezPoints.elements.at(1), bezPoints.elements.at(5), bezPoints.elements.at(9));
		p2.set(bezPoints.elements.at(2), bezPoints.elements.at(6), bezPoints.elements.at(10));
		p3.set(bezPoints.elements.at(3), bezPoints.elements.at(7), bezPoints.elements.at(11));
		var controlP = [p0, p1, p2, p3]

		// On utilise l'algorithme deCasteljau pour trouver notre point interpolé et sa tangente normalisée
		const [pInter, dp] = TP3.Geometry.deCasteljau(controlP, t);
		// console.log(pInter); // For testing, todo remove before submission
		// console.log(dp);
		return [pInter, dp];
	},

	// Trouver l'axe et l'angle de rotation entre deux vecteurs
	findRotation: function (a, b) {
		const axis = new THREE.Vector3().crossVectors(a, b).normalize();
		var c = a.dot(b) / (a.length() * b.length());

		if (c < -1) {
			c = -1;
		} else if (c > 1) {
			c = 1;
		}

		const angle = Math.acos(c);

		return [axis, angle];
	},

	findRotationMatrix: function(axe, angle){
		const sinA = Math.sin(angle);
		const cosA = Math.cos(angle);
		const unMoinsCosA = 1.0 - cosA;
		let rotationMatrix = new THREE.Matrix3();

		return rotationMatrix.set((axe.x * axe.x * unMoinsCosA) + cosA, (axe.y * axe.x * unMoinsCosA) - (sinA * axe.z),
			(axe.z * axe.x * unMoinsCosA) + (sinA * axe.y), (axe.x * axe.y * unMoinsCosA) + (sinA * axe.z),
			(axe.y * axe.y * unMoinsCosA) + cosA, (axe.z * axe.y * unMoinsCosA) - (sinA * axe.x),
			(axe.x * axe.z * unMoinsCosA) - (sinA * axe.y), (axe.y * axe.z * unMoinsCosA) + (sinA * axe.x),
			(axe.z * axe.z * unMoinsCosA) + cosA);

	},

	// Projeter un vecter a sur b
	project: function (a, b) {
		return b.clone().multiplyScalar(a.dot(b) / (b.lengthSq()));
	},

	// Trouver le vecteur moyen d'une liste de vecteurs
	meanPoint: function (points) {
		var mp = new THREE.Vector3();

		for (var i = 0; i < points.length; i++) {
			mp.add(points[i]);
		}

		return mp.divideScalar(points.length);
	},

	// Algorithme deCasteljau
	deCasteljau: function (controlP, t){
		var n = controlP.length;
		var pArray = [];
		var dp;

		for(let i = 0; i < n; i++){
			pArray[i] = controlP[i];
		}
		for(let j = 1; j < n; j++){
			for(let k = 0; k < n - j; k++){
				pArray[k].x = (1 - t) * pArray[k].x + t * pArray[k+1].x;
	 			pArray[k].y = (1 - t) * pArray[k].y + t * pArray[k+1].y;
				pArray[k].z = (1 - t) * pArray[k].z + t * pArray[k+1].z;
				// Les deux derniers points peuvent être utilisés pour trouver la tangente du point interpolé final.
				// Cette tangente est tout simplement le vecteur entre ces deux points.
				if(j == (n - 1)  && k == (n - j - 1) ){
					var p0 = pArray[k];
					var p1 = pArray[k + 1]
					var p0p1Vec = p1.sub(p0);
					dp = p0p1Vec.normalize();
				}
			}
			// At t=0 and t=1, the curve at the endpoints is always tangent to the straight line connecting the points and controlP[3] = p1 - p0;
			if(t == 0 || t == 1){
				dp = controlP[3];
			}
		}
		return [pArray[0], dp]; // Retourne le point interpolé et sa tangente normalisée
	},

	print:function(p){
		console.log(p)
	},

};