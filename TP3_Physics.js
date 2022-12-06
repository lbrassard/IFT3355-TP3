const appleMass = 0.075;

TP3.Physics = {
	initTree: function (rootNode) {

		this.computeTreeMass(rootNode);

		var stack = [];
		stack.push(rootNode);

		while (stack.length > 0) {
			var currentNode = stack.pop();
			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}

			currentNode.bp0 = currentNode.p0.clone();
			currentNode.bp1 = currentNode.p1.clone();
			currentNode.rp0 = currentNode.p0.clone();
			currentNode.rp1 = currentNode.p1.clone();
			currentNode.vel = new THREE.Vector3();
			currentNode.strength = currentNode.a0;
		}
	},

	computeTreeMass: function (node) {
		var mass = 0;

		for (var i = 0; i < node.childNode.length; i++) {
			mass += this.computeTreeMass(node.childNode[i]);
		}
		mass += node.a1;
		if (node.appleIndices !== null) {
			mass += appleMass;
		}
		node.mass = mass;

		return mass;
	},


	test: function(){
		// Tests commencent ici

		var matTransP0 = new THREE.Matrix4();
		var matTransP1 = new THREE.Matrix4();

		var n1p0 = new THREE.Vector3(0,0,0);
		var n1p1 = new THREE.Vector3(1,1,1);
		var n1p0C = n1p0.clone();
		var n1p1C = n1p1.clone();

		var n2p0 = new THREE.Vector3(1,1,1);
		var n2p1 = new THREE.Vector3(5,-2,3);

		var matNode = new THREE.Matrix4();

		// Aller à [0,0,0]
		// P0
		var mat00P0 = new THREE.Matrix4().makeTranslation(-n1p0.x,-n1p0.y,-n1p0.z);
		matTransP0 = new THREE.Matrix4().multiplyMatrices(mat00P0, matTransP0);
		n1p0C.applyMatrix4(mat00P0);

		// P1
		var mat00P1 = new THREE.Matrix4().makeTranslation(-n1p0.x,-n1p0.y,-n1p0.z);
		matTransP1 = new THREE.Matrix4().multiplyMatrices(mat00P1, matTransP1);
		n1p1C.applyMatrix4(mat00P1);

		// Faire rotation
		var velo = new THREE.Vector3(2,0,0);
		var nouvPos1 = new THREE.Vector3().addVectors(n1p1C, velo);

		var nouvVectNorm = new THREE.Vector3().subVectors(nouvPos1, n1p0C).normalize();
		var anciVectNorm = new THREE.Vector3().subVectors(n1p1C, n1p0C).normalize();
		var findRot = TP3.Geometry.findRotation(anciVectNorm, nouvVectNorm);
		var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
		var xAxis = new THREE.Vector3();
		var yAxis = new THREE.Vector3();
		var zAxis = new THREE.Vector3();
		matRot3.extractBasis(xAxis,yAxis,zAxis);
		var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
		n1p1C.applyMatrix4(matRot4);

		matTransP1 = new THREE.Matrix4().multiplyMatrices(matRot4, matTransP1);

		// Retourner au bon endroit
		var matAnciP0 = new THREE.Matrix4().makeTranslation(n1p0.x,n1p0.y,n1p0.z);
		var matAnciP1 = new THREE.Matrix4().makeTranslation(n1p0.x,n1p0.y,n1p0.z);

		matTransP0 = new THREE.Matrix4().multiplyMatrices(matAnciP0, matTransP0);
		matTransP1 = new THREE.Matrix4().multiplyMatrices(matAnciP1, matTransP1);

		// Appliquer toutes les transformations
		//n1p0.applyMatrix4(matTransP0);
		n1p1.applyMatrix4(matTransP1);

		matNode = new THREE.Matrix4().multiplyMatrices(matTransP1, matNode);

		// C'est beau jusqu'ici

		// Deuxième branche
		var matTransP0_2 = new THREE.Matrix4();
		var matTransP1_2 = new THREE.Matrix4();

		n2p0 = n1p1;
		n2p1.applyMatrix4(matNode);
		var n2p0C = n2p0.clone();
		var n2p1C = n2p1.clone();

		//window.alert(("[" + n1p0.x + ",")+(n1p0.y + ",")+(n1p0.z + "]"));
		//window.alert(("[" + n1p1.x + ",")+(n1p1.y + ",")+(n1p1.z + "]"));
		//window.alert(("[" + n2p0.x + ",")+(n2p0.y + ",")+(n2p0.z + "]"));
		//window.alert(("[" + n2p1.x + ",")+(n2p1.y + ",")+(n2p1.z + "]"));

		//window.alert(new THREE.Vector3().subVectors(n2p1, n2p0).length());

		// Aller à [0,0,0]
		// P0
		var mat00P0 = new THREE.Matrix4().makeTranslation(-n2p0.x,-n2p0.y,-n2p0.z);
		matTransP0_2 = new THREE.Matrix4().multiplyMatrices(mat00P0, matTransP0_2);
		n2p0C.applyMatrix4(mat00P0);

		// P1
		var mat00P1 = new THREE.Matrix4().makeTranslation(-n2p0.x,-n2p0.y,-n2p0.z);
		matTransP1_2 = new THREE.Matrix4().multiplyMatrices(mat00P1, matTransP1_2);
		n2p1C.applyMatrix4(mat00P1);

		// Faire rotation
		var velo = new THREE.Vector3(2,0,0);
		var nouvPos2 = new THREE.Vector3().addVectors(n2p1C, velo);

		var nouvVectNorm = new THREE.Vector3().subVectors(nouvPos2, n2p0C).normalize();
		var anciVectNorm = new THREE.Vector3().subVectors(n2p1C, n2p0C).normalize();
		var findRot = TP3.Geometry.findRotation(anciVectNorm, nouvVectNorm);
		var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
		var xAxis = new THREE.Vector3();
		var yAxis = new THREE.Vector3();
		var zAxis = new THREE.Vector3();
		matRot3.extractBasis(xAxis,yAxis,zAxis);
		var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
		n2p1C.applyMatrix4(matRot4);

		matTransP1_2 = new THREE.Matrix4().multiplyMatrices(matRot4, matTransP1_2);

		// Retourner au bon endroit
		var matAnciP0 = new THREE.Matrix4().makeTranslation(n2p0.x,n2p0.y,n2p0.z);
		var matAnciP1 = new THREE.Matrix4().makeTranslation(n2p0.x,n2p0.y,n2p0.z);

		matTransP0_2 = new THREE.Matrix4().multiplyMatrices(matAnciP0, matTransP0_2);
		matTransP1_2 = new THREE.Matrix4().multiplyMatrices(matAnciP1, matTransP1_2);

		// Appliquer toutes les transformations
		n2p0.applyMatrix4(matTransP0_2);
		n2p1.applyMatrix4(matTransP1_2);

		matNode = new THREE.Matrix4().multiplyMatrices(matTransP1_2, matNode);

		//window.alert(("[" + n1p0.x + ",")+(n1p0.y + ",")+(n1p0.z + "]"));
		//window.alert(("[" + n1p1.x + ",")+(n1p1.y + ",")+(n1p1.z + "]"));
		//window.alert(("[" + n2p0.x + ",")+(n2p0.y + ",")+(n2p0.z + "]"));
		//window.alert(("[" + n2p1.x + ",")+(n2p1.y + ",")+(n2p1.z + "]"));

		//window.alert(new THREE.Vector3().subVectors(n2p1, n2p0).length());

		var n3p0 = new THREE.Vector3(5,-2,3);
		var n3p1 = new THREE.Vector3(5,2,3);

		n3p0 = n2p1;
		n3p1.applyMatrix4(matNode);

		//window.alert(("[" + n3p0.x + ",")+(n3p0.y + ",")+(n3p0.z + "]"));
		//window.alert(("[" + n3p1.x + ",")+(n3p1.y + ",")+(n3p1.z + "]"));

		//window.alert(new THREE.Vector3().subVectors(n3p1, n3p0).length());
	},

	applyForces: function (node, dt, time) {

		var u = Math.sin(1 * time) * 4;
		u += Math.sin(2.5 * time) * 2;
		u += Math.sin(5 * time) * 0.4;

		var v = Math.cos(1 * time + 56485) * 4;
		v += Math.cos(2.5 * time + 56485) * 2;
		v += Math.cos(5 * time + 56485) * 0.4;

		// Ajouter le vent
		node.vel.add(new THREE.Vector3(u / Math.sqrt(node.mass), 0, v / Math.sqrt(node.mass)).multiplyScalar(dt));
		// Ajouter la gravite
		//node.vel.add(new THREE.Vector3(0, -node.mass, 0).multiplyScalar(dt));

		// TODO: Projection du mouvement, force de restitution et amortissement de la velocite

		// Appliquer aux branches la matrice parent
		if (node.parentNode != null){
			node.p0 = node.parentNode.p1;
			node.matNode = node.parentNode.matNode;
			node.p1.applyMatrix4(node.matNode);
		}

			// Si nous sommes au noeud parent, c'est le temps de commencer
		// une nouvelle matrice de transformation
		else{
			node.matNode = new THREE.Matrix4();
		}

		// La tranformation qu'on va appliquer à p1
		var matTransP1 = new THREE.Matrix4();

		var np0C = node.p0.clone();
		var np1C = node.p1.clone();

		var matNode = node.matNode;

		// Matrices de transformation pour aller à [0,0,0]
		var mat00P0 = new THREE.Matrix4().makeTranslation(-node.p0.x,-node.p0.y,-node.p0.z);
		np0C.applyMatrix4(mat00P0);

		var mat00P1 = new THREE.Matrix4().makeTranslation(-node.p0.x,-node.p0.y,-node.p0.z);
		matTransP1 = new THREE.Matrix4().multiplyMatrices(mat00P1, matTransP1);
		np1C.applyMatrix4(mat00P1);

		// Matrice de transformation pour faire la bonne rotation
		var velo = node.vel.clone().multiplyScalar(dt);
		var nouvPos = new THREE.Vector3().addVectors(np1C, velo);
		var nouvVectNorm = new THREE.Vector3().subVectors(nouvPos, np0C).normalize();
		var anciVectNorm = new THREE.Vector3().subVectors(np1C, np0C).normalize();
		var findRot = TP3.Geometry.findRotation(anciVectNorm, nouvVectNorm);
		var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
		var xAxis = new THREE.Vector3();
		var yAxis = new THREE.Vector3();
		var zAxis = new THREE.Vector3();
		matRot3.extractBasis(xAxis,yAxis,zAxis);
		var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
		np1C.applyMatrix4(matRot4);

		matTransP1 = new THREE.Matrix4().multiplyMatrices(matRot4, matTransP1);

		// Matrice de transformation pour retourner à la bonne position
		var matAnciP1 = new THREE.Matrix4().makeTranslation(node.p0.x,node.p0.y,node.p0.z);

		matTransP1 = new THREE.Matrix4().multiplyMatrices(matAnciP1, matTransP1);

		// Appliquer toutes les transformations
		node.p1.applyMatrix4(matTransP1);
		node.matNode = new THREE.Matrix4().multiplyMatrices(matTransP1, matNode);

		// Calculer la vraie vélocité après la projection
		var anciPos = node.p1.clone();
		var vectAnciPos = new THREE.Vector3().subVectors(anciPos, node.p0);
		var vectPosActu = new THREE.Vector3().subVectors(node.p1, node.p0);

		//var vraiVol = new THREE.Vector3().subVectors(node.p1, anciPos);
		var vraiVol = new THREE.Vector3().subVectors(vectPosActu, vectAnciPos);


		// Remplacer l'ancienne vélocité par cette vraie vélocité projetée
		node.vel = vraiVol.multiplyScalar(dt);

		// Calculer l'angle de restitution de la branche
		//var normAnciPos = anciPos.clone().normalize();
		//var normNodep1 = node.p1.clone().normalize();
		var normAnciPos = vectAnciPos.clone().normalize();
		var normNodep1 = vectPosActu.clone().normalize();

		var findRotResti = TP3.Geometry.findRotation(normAnciPos, normNodep1);
		var axeResti = findRotResti[0];
		var angleResti = findRotResti[1]**2;

		// Trouver la matrice de rotation de la restitution
		var matRot3Resti = TP3.Geometry.findRotationMatrix(axeResti, angleResti);
		var xAxisResti = new THREE.Vector3();
		var yAxisResti = new THREE.Vector3();
		var zAxisResti = new THREE.Vector3();
		matRot3Resti.extractBasis(xAxisResti,yAxisResti,zAxisResti);
		var matRot4Resti = new THREE.Matrix4().makeBasis(xAxisResti,yAxisResti,zAxisResti);

		// Trouver ou serait le point avec restitution
		var pt = node.p1.clone();
		pt.applyMatrix4(matRot4Resti);

		// Calculer le vecteur de la vélocité de la restitution
		var veloResti = new THREE.Vector3().subVectors(pt, node.p1);
		veloResti.multiplyScalar(0.7*node.a0*1000*dt);

		// La restitution sera appliquée au prohain temps
		node.vel.add(veloResti).multiplyScalar(dt);

		// Appel recursif sur les enfants
		for (var i = 0; i < node.childNode.length; i++) {
			this.applyForces(node.childNode[i], dt, time);
		}
	}
}