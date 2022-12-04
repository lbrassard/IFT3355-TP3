
class Node {
	constructor(parentNode) {
		this.parentNode = parentNode; //Noeud parent
		this.childNode = []; //Noeud enfants

		this.p0 = null; //Position de depart de la branche
		this.p1 = null; //Position finale de la branche

		this.a0 = null; //Rayon de la branche a p0
		this.a1 = null; //Rayon de la branche a p1

		this.sections = null; //Liste contenant une liste de points représentant les segments circulaires du cylindre généralisé
		this.matNode = new THREE.Matrix4(); //Matrice de rotation pour l'animation
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
		let stack = []; // On utilise un stack pour effectuer la recherche en profondeur.
		stack.push(rootNode);

		while(stack.length > 0) {
			let currentNode = stack.pop();
			for (let i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}

			let h0 = currentNode.p0;
			let h1 = currentNode.p1;
			let v0 = new THREE.Vector3(0,0,0);
			if(currentNode.parentNode != null) {
				v0.subVectors(currentNode.parentNode.p1, currentNode.parentNode.p0);
			}
			let v1 = new THREE.Vector3().subVectors(currentNode.p1, currentNode.p0);

			currentNode.sections = [];
			//On cherche autant de segments que de length divisions
			for (let i = 0; i <= lengthDivisions; i++) {
				let t = i / (lengthDivisions);
				var [p, vt] = this.hermite(h0, h1, v0, v1, t); // on obtient notre point interpolé de notre segment et sa tangente.
				if(t != 1){var [p2, vt2] = this.hermite(h0, h1, v0, v1, t + 1 / (lengthDivisions));}
				else{
					[p2, vt2] = [p, vt]};


				let circlePtArray = [];
				// À t = 0  les points de notre section proviennent de son parent à t = 1.
				if(t == 0 && currentNode.parentNode != null ) {
					currentNode.sections = currentNode.parentNode.sections.slice(4);
					continue;
				}
				// Notre rayon interpolé pour le segment en question.
				let rInter = currentNode.a1 * t + currentNode.a0 * (1 - t);

				// Un cercle a une circonférence de 2pi, donc chaque point sera séparé par un angle de theta = 2pi / radialDivisions.
				let theta = 2 * Math.PI / radialDivisions;

				// Trouver v pour notre frame, vt est notre axe u
				let v = new THREE.Vector3(0, 0, 0);
				if (vt.x != 0 || vt.y != 0) {
					v = new THREE.Vector3(0, 0, 1);
				} else if (vt.x != 0 || vt.z != 0) {
					v = new THREE.Vector3(0, 1, 0);
				} else if (vt.y != 0 || vt.z != 0) {
					v = new THREE.Vector3(1, 0, 0);
				}
				// Reste à trouver notre axe w
				let w = new THREE.Vector3().crossVectors(vt, v);
				let r1 = v.multiplyScalar(rInter * Math.cos(theta));
				let r2 = w.multiplyScalar(rInter * Math.sin(theta));
				let point = new THREE.Vector3(r1.x + r2.x,
					r1.y + r2.y,
					r1.z + r2.z);

				// Nous avons besoin d'autant de points que de radial divisions.
				for (let j = 0; j < radialDivisions; j++) {
					let circleP = new THREE.Vector3(point.x, point.y, point.z);
					// On effectue une translation pour positionner le point à proximité du point interpolé de la courbe.
					let translationMat = new THREE.Matrix4().makeTranslation(p.x, p.y, p.z);
					circleP.applyMatrix4(translationMat);
					circlePtArray.push(circleP);

					// Ces points sont tous positionnés autour du même axe et donc pour obtenir la position des autres points,
					// on fait tourner le point initial comme une toupie pour une rotation complète.
					point.applyAxisAngle(vt,theta);
				}
				currentNode.sections.push(circlePtArray);
			}
		}
		return rootNode;
	},

	hermite: function (h0, h1, v0, v1, t) {
		// Nos points Hermite, représentés par une matrice
		let herPoints = new THREE.Matrix4();
		herPoints.set(h0.x, h0.y, h0.z, 1,
			h1.x, h1.y, h1.z, 1,
			v0.x, v0.y, v0.z, 1,
			v1.x, v1.y, v1.z, 1);

		// Matrice pour convertir d'Hermite à Bézier
		let herToBezMat = new THREE.Matrix4();
		herToBezMat.set(3, 0,0,0,
			3,0,1,0,
			0,3,0,-1,
			0,3,0,0);

		// Conversion de points Hermite à points Bézier
		let bezPoints = new THREE.Matrix4();
		bezPoints = bezPoints.multiplyMatrices(herToBezMat, herPoints);
		bezPoints = bezPoints.multiplyScalar(1/3);

		// Pour obtenir nos points de contrôle p0, p1, p2, p3, nous les extrayons de notre matrice Bézier
		// En ce qui concerne les indices utilisés, rappel que les matrices dans THREE.js sont ordonnées par colonne.
		let p0 = new THREE.Vector3(bezPoints.elements.at(0), bezPoints.elements.at(4), bezPoints.elements.at(8));
		let p1 = new THREE.Vector3(bezPoints.elements.at(1), bezPoints.elements.at(5), bezPoints.elements.at(9));
		let p2 = new THREE.Vector3(bezPoints.elements.at(2), bezPoints.elements.at(6), bezPoints.elements.at(10));
		let p3 = new THREE.Vector3(bezPoints.elements.at(3), bezPoints.elements.at(7), bezPoints.elements.at(11));
		let controlP = [p0, p1, p2, p3]

		// On utilise l'algorithme deCasteljau pour trouver notre point interpolé et sa tangente normalisée.
		const [pInter, dp] = TP3.Geometry.deCasteljau(controlP, t);
		return [pInter, dp];
	},

	// Algorithme deCasteljau
	deCasteljau: function (controlP, t){
		let n = controlP.length;
		let pArray = [];

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
				if(j === (n - 1)  && k === (n - j - 1) ){
					let p0 = pArray[k];
					let p1 = pArray[k + 1]
					if(t > 0 && t < 1){
						var dp= new THREE.Vector3().subVectors(p1,p0).normalize();
					}
					// At t=0 and t=1, the curve at the endpoints is always tangent to the straight line connecting the points and controlP[3] = p1 - p0;
					else{
						dp = controlP[3].normalize();
					}
				}
			}
		}
		return [pArray[0], dp]; // Retourne le point interpolé et sa tangente normalisée
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

};