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
		//var vect = new THREE.Vector3(2,2,0);
		//var vect2 = new THREE.Vector3(-1,1,0);
		//var vect3 = vect2.clone().multiplyScalar(2);

		//var vectR = new THREE.Vector3().addVectors(vect, vect2.multiplyScalar(2));
		//var vectR = new THREE.Vector3().subVectors(vect, vect2);
		//var vectR = new THREE.Vector3(1,1,1).normalize();
		//window.alert(("[" + vect.x + ",")+(vect.y + ",")+(vect.z + "]"));
		//window.alert(("[" + matRot[0].x + ",")+(matRot[0].y + ",")+(matRot[0].z + "]"));

		//var matRot = TP3.Geometry.findRotation(vect,vect2);
		//var matriceRot = TP3.Geometry.findRotationMatrix(matRot[0], matRot[1]);
		//var xAxis = new THREE.Vector3();
		//var yAxis = new THREE.Vector3();
		//var zAxis = new THREE.Vector3();

		//window.alert(("[" + xAxis.x + ",")+(xAxis.y + ",")+(xAxis.z + "]")+","+
		//("[" + yAxis.x + ",")+(yAxis.y + ",")+(yAxis.z + "]")+","+
		//("[" + zAxis.x + ",")+(zAxis.y + ",")+(zAxis.z + "]"));

		//matriceRot.extractBasis(xAxis,yAxis,zAxis);

		//window.alert(("[" + xAxis.x + ",")+(xAxis.y + ",")+(xAxis.z + "]")+","+
		//("[" + yAxis.x + ",")+(yAxis.y + ",")+(yAxis.z + "]")+","+
		//("[" + zAxis.x + ",")+(zAxis.y + ",")+(zAxis.z + "]"));

		//var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);

		//window.alert(yAxis.x);
		//window.alert(matRot4.elements[3]);

		//var anciPos = vect.clone();
		//vect.applyMatrix4(matRot4);

		//window.alert(("[" + anciPos.x + ",")+(anciPos.y + ",")+(anciPos.z + "]"));
		//window.alert(("[" + vect.x + ",")+(vect.y + ",")+(vect.z + "]"));

		//window.alert(2**2);

		//var vect = new THREE.Vector3(1,0,0);
		//var vect2 = new THREE.Vector3(0,1,0);

		//var matRot = TP3.Geometry.findRotation(vect,vect2);
		//var axe = matRot[0];
		//var angle = matRot[1]**2;

		//window.alert(angle);

		//var matRot3 = TP3.Geometry.findRotationMatrix(axe, angle);
		//var xAxis = new THREE.Vector3();
		//var yAxis = new THREE.Vector3();
		//var zAxis = new THREE.Vector3();
		//matRot3.extractBasis(xAxis,yAxis,zAxis);
		//var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);

		//var pos = vect.clone();

		//pos.applyMatrix4(matRot4);

		//window.alert(("[" + vect.x + ",")+(vect.y + ",")+(vect.z + "]"));
		//window.alert(("[" + pos.x + ",")+(pos.y + ",")+(pos.z + "]"));

		//var n1p0 = new THREE.Vector3(0,0,0);
		//var n1p1 = new THREE.Vector3(0,2,0);
		//var branche1Len = new THREE.Vector3().subVectors(n1p1, n1p0).length();
		//window.alert("len branche 1 avant rotation branche 1: " + branche1Len);

		//var n2p0 = new THREE.Vector3(0,2,0);
		//var n2p1 = new THREE.Vector3(0,5,0);
		//var branche2Len = new THREE.Vector3().subVectors(n2p1, n2p0).length();
		//window.alert("len branche 2 avant rotation branche 1: "+ branche2Len);

		//var velo = new THREE.Vector3(1,0,0);
		//var nouvPos1 = new THREE.Vector3().addVectors(n1p1, velo);

		//var nouvVectNorm = new THREE.Vector3().subVectors(nouvPos1, n1p0).normalize();
		//var anciVectNorm = new THREE.Vector3().subVectors(n1p1, n1p0).normalize();
		//var findRot = TP3.Geometry.findRotation(nouvVectNorm, anciVectNorm);
		//var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
		//var xAxis = new THREE.Vector3();
		//var yAxis = new THREE.Vector3();
		//var zAxis = new THREE.Vector3();
		//matRot3.extractBasis(xAxis,yAxis,zAxis);
		//var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);

		//n1p1.applyMatrix4(matRot4);
		//n2p0.applyMatrix4(matRot4);
		//n2p1.applyMatrix4(matRot4);

		//var branche1Len = new THREE.Vector3().subVectors(n1p1, n1p0).length();
		//window.alert("len branche 1 après rotation branche 1: " + branche1Len);

		//var branche2Len = new THREE.Vector3().subVectors(n2p1, n2p0).length();
		//window.alert("len branche 2 après rotation branche 1: " + branche2Len);

		//window.alert(("[" + n1p0.x + ",")+(n1p0.y + ",")+(n1p0.z + "]"));
		//window.alert(("[" + n1p1.x + ",")+(n1p1.y + ",")+(n1p1.z + "]"));
		//window.alert(("[" + n2p0.x + ",")+(n2p0.y + ",")+(n2p0.z + "]"));
		//window.alert(("[" + n2p1.x + ",")+(n2p1.y + ",")+(n2p1.z + "]"));

		//var brancheOrigine = new THREE.Vector3().subVectors(n2p1, n2p0);
		//var nouvPos2 = new THREE.Vector3().addVectors(brancheOrigine, velo);

		//var nouvVectNorm = nouvPos2.clone().normalize();
		//var anciVectNorm = brancheOrigine.clone().normalize();
		//var findRot = TP3.Geometry.findRotation(nouvVectNorm, anciVectNorm);
		//var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
		//var xAxis = new THREE.Vector3();
		//var yAxis = new THREE.Vector3();
		//var zAxis = new THREE.Vector3();
		//matRot3.extractBasis(xAxis,yAxis,zAxis);
		//var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
		
		//brancheOrigine.applyMatrix4(matRot4);
		//n2p1 = new THREE.Vector3().addVectors(brancheOrigine, n2p0);

		//var branche1Len = new THREE.Vector3().subVectors(n1p1, n1p0).length();
		//window.alert("len branche 1 après rotation branche 2: " + branche1Len);

		//var branche2Len = new THREE.Vector3().subVectors(n2p1, n2p0).length();
		//window.alert("len branche 2 après rotation branche 2: " + branche2Len);

		//window.alert(("[" + n1p0.x + ",")+(n1p0.y + ",")+(n1p0.z + "]"));
		//window.alert(("[" + n1p1.x + ",")+(n1p1.y + ",")+(n1p1.z + "]"));
		//window.alert(("[" + n2p0.x + ",")+(n2p0.y + ",")+(n2p0.z + "]"));
		//window.alert(("[" + n2p1.x + ",")+(n2p1.y + ",")+(n2p1.z + "]"));

		var matTransP0 = new THREE.Matrix4();
		var matTransP1 = new THREE.Matrix4();

		var n1p0 = new THREE.Vector3(0,0,0);
		var n1p1 = new THREE.Vector3(0,2,0);
		var n1p0C = n1p0.clone();
		var n1p1C = n1p1.clone();
		var branche1Len = new THREE.Vector3().subVectors(n1p1, n1p0).length();
		//window.alert("len branche 1 avant rotation branche 1: " + branche1Len);

		var n2p0 = new THREE.Vector3(0,2,0);
		var n2p1 = new THREE.Vector3(0,5,0);
		var n2p0C = n2p0.clone();
		var n2p1C = n2p1.clone();
		var branche2Len = new THREE.Vector3().subVectors(n2p1, n2p0).length();
		//window.alert("len branche 2 avant rotation branche 1: "+ branche2Len);

		// Aller à [0,0,0]
		// P0
		var mat00P0 = new THREE.Matrix4().makeTranslation(-n1p0.x,-n1p0.y,-n1p0.z);
		n1p0C.applyMatrix4(matTransP0);

		matTransP0 = new THREE.Matrix4().multiplyMatrices(matTransP0, mat00P0);

		// P1
		var mat00P1 = new THREE.Matrix4().makeTranslation(-n1p0.x,-n1p0.y,-n1p0.z);
		n1p1C.applyMatrix4(matTransP1);

		matTransP1 = new THREE.Matrix4().multiplyMatrices(matTransP1, mat00P1);
		
		// Faire rotation
		var velo = new THREE.Vector3(2,0,0);
		var nouvPos1 = new THREE.Vector3().addVectors(n1p1C, velo);

		var nouvVectNorm = new THREE.Vector3().subVectors(nouvPos1, n1p0C).normalize();
		var anciVectNorm = new THREE.Vector3().subVectors(n1p1C, n1p0C).normalize();

		// Peut-être ici le prob
		var findRot = TP3.Geometry.findRotation(anciVectNorm, nouvVectNorm);
		var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
		var xAxis = new THREE.Vector3();
		var yAxis = new THREE.Vector3();
		var zAxis = new THREE.Vector3();
		matRot3.extractBasis(xAxis,yAxis,zAxis);
		var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
		n1p1C.applyMatrix4(matRot4);

		matTransP1 = new THREE.Matrix4().multiplyMatrices(matTransP1, matRot4);

		// Retourner au bon endroit
		var matAnciP0 = new THREE.Matrix4().makeTranslation(n1p0.x,n1p0.y,n1p0.z);
		var matAnciP1 = new THREE.Matrix4().makeTranslation(n1p0.x,n1p0.y,n1p0.z);

		matTransP0 = new THREE.Matrix4().multiplyMatrices(matTransP0, matAnciP0);
		matTransP1 = new THREE.Matrix4().multiplyMatrices(matTransP1, matAnciP1);

		// Appliquer toutes les transformations
		n1p0.applyMatrix4(matTransP0);
		n1p1.applyMatrix4(matTransP1);

		//window.alert(("[" + n1p0.x + ",")+(n1p0.y + ",")+(n1p0.z + "]"));
		//window.alert(("[" + n1p1.x + ",")+(n1p1.y + ",")+(n1p1.z + "]"));
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
		node.vel.add(new THREE.Vector3(0, -node.mass, 0).multiplyScalar(dt));

		// TODO: Projection du mouvement, force de restitution et amortissement de la velocite

		if (node.parentNode == null){

			// Calculer la nouvelle position sans contraintes de longueur
			var velocite = node.vel.clone().multiplyScalar(dt);
			var nouvPos = new THREE.Vector3().addVectors(node.p1, velocite);

			// Trouver la matrice de rotation entre la nouvelle position et l'ancienne
			var nouvVectNorm = new THREE.Vector3().subVectors(nouvPos, node.p0).normalize();
			var anciVectNorm = new THREE.Vector3().subVectors(node.p1, node.p0).normalize();
			var findRot = TP3.Geometry.findRotation(nouvVectNorm, anciVectNorm);
			var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
			var xAxis = new THREE.Vector3();
			var yAxis = new THREE.Vector3();
			var zAxis = new THREE.Vector3();
			matRot3.extractBasis(xAxis,yAxis,zAxis);
			var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);

			// Appliquer cette matrice à p1 afin de garder sa longueur
			var anciPos = node.p1.clone();
			node.p1.applyMatrix4(matRot4);

			// Ajouter l'information au noeud pour la récursivité
			node.matRot = matRot4;

			// Calculer la vraie vélocité après la projection
			var vraiVol = new THREE.Vector3().subVectors(node.p1, anciPos);

			// Remplacer l'ancienne vélocité par cette vraie vélocité projetée
			node.vel = vraiVol.multiplyScalar(dt);

			// Calculer l'angle de restitution de la branche
			var normAnciPos = anciPos.clone().normalize();
			var normNodep1 = node.p1.clone().normalize();
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
			node.vel.add(veloResti);
		}

		else{
			node.p1.applyMatrix4(node.parentNode.matRot);
			node.p0.applyMatrix4(node.parentNode.matRot);
			node.p0 = node.parentNode.p1;

			// Calculer la nouvelle position sans contraintes de longueur
			var velocite = node.vel.clone().multiplyScalar(dt);
			var brancheOrigine = new THREE.Vector3().subVectors(node.p1, node.p0);
			var nouvPos = new THREE.Vector3().addVectors(brancheOrigine, velocite);

			// Trouver la matrice de rotation entre la nouvelle position et l'ancienne

			var nouvVectNorm = nouvPos.clone().normalize();
			var anciVectNorm = brancheOrigine.clone().normalize();
			var findRot = TP3.Geometry.findRotation(nouvVectNorm, anciVectNorm);
			var matRot3 = TP3.Geometry.findRotationMatrix(findRot[0], findRot[1]);
			var xAxis = new THREE.Vector3();
			var yAxis = new THREE.Vector3();
			var zAxis = new THREE.Vector3();
			matRot3.extractBasis(xAxis,yAxis,zAxis);
			var matRot4 = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);

			// Appliquer cette matrice à p1 afin de garder sa longueur
			var anciPos = node.p1.clone();
			brancheOrigine.applyMatrix4(matRot4);
			node.p1 = new THREE.Vector3().addVectors(brancheOrigine, node.p0);

			// Ajouter l'information au noeud pour la récursivité
			//node.matRot = new THREE.Matrix4().multiplyMatrices(matRot4, node.parentNode.matRot);
			//node.matRot = matRot4;

			// Calculer la vraie vélocité après la projection
			var vraiVol = new THREE.Vector3().subVectors(node.p1, anciPos);

			// Remplacer l'ancienne vélocité par cette vraie vélocité projetée
			node.vel = vraiVol.multiplyScalar(dt);

			// Calculer l'angle de restitution de la branche
			var normAnciPos = anciPos.clone().normalize();
			var normNodep1 = node.p1.clone().normalize();
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
			node.vel.add(veloResti);
		}

		// Appel recursif sur les enfants
		for (var i = 0; i < node.childNode.length; i++) {
			this.applyForces(node.childNode[i], dt, time);
		}
	}
}