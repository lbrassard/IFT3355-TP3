
class Node {
	constructor(parentNode) {
		this.parentNode = parentNode; //Noeud parent
		this.childNode = []; //Noeud enfants

		this.p0 = null; //Position de depart de la branche
		this.p1 = null; //Position finale de la branche

		this.a0 = null; //Rayon de la branche a p0
		this.a1 = null; //Rayon de la branche a p1

		this.sections = null; //Liste contenant une liste de points représentant les segments circulaires du cylindre généralisé
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
				// if( t != 1) {
				// 	var [p, vt] = this.hermite(h0, h1, v0, v1, t); // on obtient notre point interpolé de notre segment et sa tangente.
				// 	var [p2, vt2] = this.hermite(h0, h1, v0, v1, t + 1 / (lengthDivisions));
				// }
				// else{
				// 	[p, vt] = this.hermite(h0, h1, v0, v1, t - 1 / (lengthDivisions)); // on obtient notre point interpolé de notre segment et sa tangente.
				// 	[p2, vt2] = this.hermite(h0, h1, v0, v1, t);
				// }

				// let dx = p2.x - p.x;
				// let dy = p2.y - p.y;
				// let dz = p2.z - p.z;
				// let v3 = new THREE.Vector3(dx, dy, dz).normalize();
				// let v3Arr = [v3.x, v3.y, v3.z];
				// dx = Math.abs(dx);
				// dy = Math.abs(dy);
				// dz = Math.abs(dz);
				// let v3Abs = [dx, dy, dz];
				//
				// let max = Math.max(v3Abs[0], v3Abs[1], v3Abs[2]);
				// let min = Math.min(v3Abs[0], v3Abs[1], v3Abs[2]);
				//
				// let maxIndex = 0;
				// let medIndex = 0;
				// let minIndex = 0;
				//
				// //Loop through p_abs array to find which magnitudes are equal to maxval & minval. Store their indexes for use later.
				// for(let l = 0; l < 3; l++) {
				// 	if (v3Abs[l] == max) maxIndex = l;
				// 	else if (v3Abs[l] == min) minIndex = l;
				// }
				//
				// //Find the remaining index which has the medium magnitude
				// for(let k = 0; i < 3; k++) {
				// 	if (k!=maxIndex && k!=minIndex) {
				// 		medIndex = k;
				// 		break;
				// 	}
				// }
				//
				// //Store the maximum magnitude for now.
				// let storeMax = (v3Arr[maxIndex]);
				//
				// //Swap the 2 indexes that contain the maximum & medium magnitudes, negating maximum. Set minimum magnitude to zero.
				// v3Arr[maxIndex] = (p[medIndex]);
				// v3Arr[medIndex] = -storeMax;
				// v3Arr[minIndex] = 0;
				//
				// //Calculate v1. Perpendicular to v3.
				// let s = Math.sqrt(v3.x*v3.x + v3.z*v3.z + v3.y*v3.y);
				// let v1x = s * v3Arr[0];
				// let v1y = s * v3Arr[1];
				// let v1z = s * v3Arr[2];
				//
				// //Calculate v2 as cross product of v3 and v1.
				// let v2x = v3.y*v1.z - v3.z*v1.y;
				// let v2y = v3.z*v1.x - v3.x*v1.z;
				// let v2z = v3.x*v1.y - v3.y*v1.x;


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

				let point = new THREE.Vector3(0, 0, 0);
				if(vt.y != 0) {
					// y |\         On cherche l'angle formé par le y de notre tangente et l'hypoténuse qu'elle forme
					//   | \ h = 1  pour savoir de combien rotationner notre point par rapport à l'axe des x.
					//   | a\
					let angle = Math.PI / 2 - Math.asin(vt.y/1);
					if(vt.z < 0){
						angle = angle - 2 * Math.PI;
					}
					point = new THREE.Vector3(Math.abs(rInter * Math.cos(angle)), rInter * Math.sin(angle), 0);
					let axis = new THREE.Vector3().cross( vt, vt2 );
					let xRotate = new THREE.Matrix4().makeRotationAxis(axis, angle);
					point.applyMatrix4(xRotate);
				}
				// let circlePointx = p2.x + rInter * (v1.x * Math.cos(theta) + v2x * Math.sin(theta));
				// let circlePointy = p2.y + rInter * (v1.y * Math.cos(theta) + v2y * Math.sin(theta));
				// let circlePointz = p2.z + rInter * (v1.z * Math.cos(theta) + v2z * Math.sin(theta));
				// point.set(circlePointx, circlePointy, circlePointz);
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
				// Cette tangente est tout simplement le vecteur obtenu à partir de ces deux points.
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