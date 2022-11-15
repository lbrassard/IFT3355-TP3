
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
				c.childNode[0].parentNode = rootNode;
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
			// fini d'explorer cette branches, nous sommes a une extremite
			// et donc rien a simplifier ici
		}

		// might need to change this if ever our tree doesn't start at 0,0,0
		if (rootNode.p0 == new THREE.Vector3(0,0,0) ){
			return rootNode;
		}
	}
	,

	generateSegmentsHermite: function (rootNode, lengthDivisions = 4, radialDivisions = 8) {
		//TODO
	},

	hermite: function (h0, h1, v0, v1, t) {
		//TODO
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

	print:function(p){
		console.log(p)
	},

};