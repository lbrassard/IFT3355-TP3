TP3.Render = {
	drawTreeRough: function (rootNode, scene, alpha, radialDivisions = 8, leavesCutoff = 0.1, leavesDensity = 10, applesProbability = 0.05, matrix = new THREE.Matrix4()) {
		//TODO

		let branch = new THREE.Vector3().subVectors(rootNode.p1,rootNode.p0);
		var transformationMatrix = new THREE.Matrix4();

		// branche non-terminale de l'arbre
		if (rootNode.childNode != 0){
			// ajoute la base de l'arbre
			if (rootNode.parentNode == null){
				let matrix  = new THREE.Matrix4().identity();

				let material = new THREE.MeshLambertMaterial({color: 0x8B5A2B});
				let geometry = new THREE.CylinderBufferGeometry(rootNode.a1,rootNode.a0,branch.length());
				let cylinder = new THREE.Mesh(geometry,material);
				cylinder.applyMatrix4(matrix);
				scene.add(cylinder);

			// ajoute les branches de l'arbre
			}else {

				// make rotation matrix between parent and rootNode
				let parent_branch = new THREE.Vector3().subVectors(rootNode.parentNode.p1,rootNode.parentNode.p0);
				let rotation = TP3.Geometry.findRotation(parent_branch,branch);
				let rot3 = TP3.Geometry.findRotationMatrix(rotation[0],rotation[1]);
				let xAxis = new THREE.Vector3();
				let yAxis = new THREE.Vector3();
				let zAxis = new THREE.Vector3();
				rot3.extractBasis(xAxis,yAxis,zAxis);
				let childRotation = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
				let parentRotation = new THREE.Matrix4().extractRotation(matrix);
				let rotationMatrix = new THREE.Matrix4().multiplyMatrices(childRotation,parentRotation);

				// Make translation matrix between parent and rootNode
				let x_t = branch.x;
				let y_t = branch.y;
				let z_t = branch.z;
				let childTranslation = new THREE.Matrix4().makeTranslation(x_t,y_t,z_t);
				let parentTranslation = new THREE.Matrix4().copyPosition(matrix);
				let translationMatrix = new THREE.Matrix4().multiplyMatrices(childTranslation,parentTranslation);

				transformationMatrix.multiplyMatrices(translationMatrix,rotationMatrix);

				let material = new THREE.MeshLambertMaterial({color: 0x8B5A2B});
				let geometry = new THREE.CylinderBufferGeometry(rootNode.a1,rootNode.a0,branch.length());
				let cylinder = new THREE.Mesh(geometry,material);
				cylinder.applyMatrix4(transformationMatrix);
				scene.add(cylinder);


			}
		// branche terminale de l'arbre et les feuilles/pommes
		}else {

			// make rotation matrix between parent and rootNode
			let parent_branch = new THREE.Vector3().subVectors(rootNode.parentNode.p1,rootNode.parentNode.p0);
			let rotation = TP3.Geometry.findRotation(parent_branch,branch);
			let rot3 = TP3.Geometry.findRotationMatrix(rotation[0],rotation[1]);
			let xAxis = new THREE.Vector3();
			let yAxis = new THREE.Vector3();
			let zAxis = new THREE.Vector3();
			rot3.extractBasis(xAxis,yAxis,zAxis);
			let childRotation = new THREE.Matrix4().makeBasis(xAxis,yAxis,zAxis);
			let parentRotation = new THREE.Matrix4().extractRotation(matrix);
			let rotationMatrix = new THREE.Matrix4().multiplyMatrices(childRotation,parentRotation);

			// Make translation matrix between parent and rootNode
			let x_t = branch.x;
			let y_t = branch.y;
			let z_t = branch.z;
			let childTranslation = new THREE.Matrix4().makeTranslation(x_t,y_t,z_t);
			let parentTranslation = new THREE.Matrix4().copyPosition(matrix);
			let translationMatrix = new THREE.Matrix4().multiplyMatrices(childTranslation,parentTranslation);

			transformationMatrix.multiplyMatrices(translationMatrix,rotationMatrix);

			let material = new THREE.MeshLambertMaterial({color: 0x8B5A2B});
			let geometry = new THREE.CylinderBufferGeometry(rootNode.a1,rootNode.a0,branch.length());
			let cylinder = new THREE.Mesh(geometry,material);
			cylinder.applyMatrix4(transformationMatrix);
			scene.add(cylinder);



			// passer la matrice de position de la branche pour positioner les feuilles
			// placer les feuilles sur les nœuds terminaux
			if (rootNode.a0 < alpha*leavesCutoff) {
				let tm = new THREE.Matrix4().copy(translationMatrix);
				for (var i = 0; i<leavesDensity; i++){

					let material = new THREE.MeshPhongMaterial({color: 0x3A5F0B});
					let geometry = new THREE.PlaneBufferGeometry(alpha,alpha);
					var plane = new THREE.Mesh(geometry,material);

					//create random rotation matrix in a range (0 - 2pi)
					let rotationMatrix = new THREE.Matrix4().identity();
					let rotX = new THREE.Matrix4().makeRotationX(THREE.MathUtils.randFloat(0,2*Math.PI));
					let rotY = new THREE.Matrix4().makeRotationY(THREE.MathUtils.randFloat(0,2*Math.PI));
					let rotZ = new THREE.Matrix4().makeRotationZ(THREE.MathUtils.randFloat(0,2*Math.PI));

					rotationMatrix.multiplyMatrices(rotationMatrix,rotX);
					rotationMatrix.multiplyMatrices(rotationMatrix,rotY);
					rotationMatrix.multiplyMatrices(rotationMatrix,rotZ);



					//create random translation matrix in a range
					let x_rand = THREE.MathUtils.randFloat(-alpha/2,alpha/2);
					let y_rand = THREE.MathUtils.randFloat(-alpha/2,alpha/2);
					let z_rand = THREE.MathUtils.randFloat(-alpha/2,alpha/2);
					let translation = new THREE.Matrix4().makeTranslation(x_rand,y_rand,z_rand);
					let leafTranslation =new THREE.Matrix4().multiplyMatrices(translation,tm)

					let transform = new THREE.Matrix4().multiplyMatrices(leafTranslation,rotationMatrix);

					plane.applyMatrix4(transform);
					scene.add(plane);
				}


				// placer les pommes
				if (THREE.MathUtils.randFloat(0,1) < applesProbability ){
					let material_apple = new THREE.MeshPhongMaterial({color: 0x5F0B0B});
					let geometry = new THREE.BoxBufferGeometry(alpha,alpha,alpha);
					let cube = new THREE.Mesh(geometry,material_apple);
					cube.applyMatrix4(tm);
					scene.add(cube);
				}
			}
		}

		//itere sur tous les enfants du node observer
		for (let i =0 ; i<rootNode.childNode.length; i++){
			this.drawTreeRough(rootNode.childNode[i],scene,alpha,radialDivisions,leavesCutoff,leavesDensity,applesProbability,transformationMatrix.clone())
		}

	},

	drawTreeHermite: function (rootNode, scene, alpha, leavesCutoff = 0.1, leavesDensity = 10, applesProbability = 0.05, matrix = new THREE.Matrix4()) {

		// stack method with mergeBufferGeometry

		const stack = [];
		stack.push(rootNode);

		//Buffer geometries qui vont créer un gros mesh
		const branches = [];
		const leaves = [];
		const apples =[];


		// itères dans notre stack pour construire toutes les branches
		while(stack.length > 0){
			let currentNode = stack.pop();
			//ajoute les enfants de la branche qu'on vient de prendre du stack
			for (let i = 0; i < currentNode.childNode.length; i++){
				stack.push(currentNode.childNode[i]);
			}

			const branchModel = new THREE.BufferGeometry();

			// Créer une branche à partir de toutes les sections
			for (let i = 0; i < currentNode.sections.length - 1; i++) {
				let currentSections = currentNode.sections[i];
				let nextSections = currentNode.sections[i + 1];

				for (let j = 0; j < currentSections.length; j++) {

					//relier le dernier point du segment au premier (faire le tour)
					let k = 0;
					if (j + 1 < currentSections.length) {
						k = j + 1;

					} else {
						k = 0
					}

					//forme premier triangle wide base down
					let vertices = [];
					let facesIdx = [];

					vertices.push(currentSections[j].x, currentSections[j].y, currentSections[j].z);
					vertices.push(currentSections[k].x, currentSections[k].y, currentSections[k].z);
					vertices.push(nextSections[j].x, nextSections[j].y, nextSections[j].z);
					let f32vertices = new Float32Array(vertices);
					let geometry = branchModel.clone();
					geometry.setAttribute("position", new THREE.BufferAttribute(f32vertices, 3))
					facesIdx.push(0,1,2);
					geometry.setIndex(facesIdx);
					geometry.computeVertexNormals();
					branches.push(geometry);

					//forme deuxième triangle wide face up
					vertices = [];
					facesIdx = [];
					vertices.push(currentSections[k].x, currentSections[k].y, currentSections[k].z);
					vertices.push(nextSections[k].x, nextSections[k].y, nextSections[k].z);
					vertices.push(nextSections[j].x, nextSections[j].y, nextSections[j].z);
					f32vertices = new Float32Array(vertices);
					let geometry2 = branchModel.clone();
					geometry2.setAttribute("position", new THREE.BufferAttribute(f32vertices, 3))
					facesIdx.push(0,1,2);
					geometry2.setIndex(facesIdx);
					geometry2.computeVertexNormals();
					branches.push(geometry2)
				}

			}

			// créer un triangle équilatéral centré en (0,0,0) pour notre model de feuille
			const points = []
			let R = alpha/Math.sqrt(3);
			points.push(R*Math.cos(0),0.0,R*Math.sin(0));
			points.push(R*Math.cos(0+2*Math.PI/3),0.0,R*Math.sin(0+2*Math.PI/3));
			points.push(R*Math.cos(0+4*Math.PI/3),0.0,R*Math.sin(0+4*Math.PI/3));
			let f32vertices = new Float32Array(points);
			const leafModel = new THREE.BufferGeometry();
			leafModel.setAttribute("position", new THREE.BufferAttribute(f32vertices,3));



			// branche non-terminale de rayon plus petite que paramètre alpha*leaveCutoff
			if (currentNode.a0 < alpha*leavesCutoff && currentNode.childNode.length != 0){

				// ajouter pomme à un nœud non terminal
				if (THREE.MathUtils.randFloat(0,1) < applesProbability ) {
					let apple = this.createRoundApple(scene,currentNode,alpha);
					apples.push(apple)
				}
				//ajouter des feuilles
				let midPoint = new THREE.Vector3().lerpVectors(currentNode.p0,currentNode.p1,0.5);
				let tm = new THREE.Matrix4().makeTranslation(midPoint.x,midPoint.y,midPoint.z);
				for ( let i = 0; i < leavesDensity; i++){
					let readyGeo = this.createRandomLeaf(leafModel.clone(),currentNode,alpha);
					readyGeo.applyMatrix4(tm);
					let faceId = [];
					faceId.push(0,1,2);
					readyGeo.setIndex(faceId);
					readyGeo.computeVertexNormals();
					leaves.push(readyGeo);
				}
			}

			// branche terminale
			if (currentNode.childNode.length == 0) {

				//ajouter pommes
				if (THREE.MathUtils.randFloat(0, 1) < applesProbability) {
					let apple = this.createRoundApple(scene, currentNode, alpha);
					apples.push(apple);

				}
				//ajouter feuilles
				let midPoint = new THREE.Vector3().lerpVectors(currentNode.p0,currentNode.p1,0.5);
				let increase = new THREE.Vector3().subVectors(currentNode.p1,currentNode.p0);
				let tm = new THREE.Matrix4().makeTranslation(midPoint.x,midPoint.y,midPoint.z);
				for ( let i = 0; i < leavesDensity; i++){
					let readyGeo = this.createRandomLeaf(leafModel.clone(),currentNode,alpha);
					readyGeo.applyMatrix4(tm);
					let faceId = [];
					faceId.push(0,1,2);
					readyGeo.setIndex(faceId);
					readyGeo.computeVertexNormals();
					leaves.push(readyGeo);

					let feuilleDepasse = readyGeo.clone();
					feuilleDepasse.applyMatrix4(new THREE.Matrix4().makeTranslation(increase.x,increase.y,increase.z))
					leaves.push(feuilleDepasse);

				}

				// ajouter un cap à la branche composé de radialDivision triangles
				// partant d'une section jusqu'à p1
				let capPoints = currentNode.sections[currentNode.sections.length - 1];
				for (let i = 0; i < capPoints.length; i++) {
					let k = 0;
					if (i + 1 < capPoints.length) {k = i + 1} else {k = 0};
					let vs = [];
					let fIdx = [];
					vs.push(currentNode.p1.x,currentNode.p1.y,currentNode.p1.z);
					vs.push(capPoints[i].x,capPoints[i].y,capPoints[i].z);
					vs.push(capPoints[k].x,capPoints[k].y,capPoints[k].z);
					let f32vertices = new Float32Array(vs);
					let geometry = branchModel.clone();
					geometry.setAttribute("position", new THREE.BufferAttribute(f32vertices,3));
					fIdx.push(0,1,2);
					geometry.setIndex(fIdx);
					geometry.computeVertexNormals();
					branches.push(geometry);
				}
			}
		}



		//créer un mesh pour nos structures de feuilles et de branches
		var tree = THREE.BufferGeometryUtils.mergeBufferGeometries(branches);
		var treeMesh = new THREE.Mesh(tree,new THREE.MeshLambertMaterial({color: 0x8B5A2B}));
		scene.add(treeMesh);

		var leaf = THREE.BufferGeometryUtils.mergeBufferGeometries(leaves);
		var leavesMesh = new THREE.Mesh(leaf, new THREE.MeshPhongMaterial({color : 0x3A5F0B, side: THREE.DoubleSide}));
		scene.add(leavesMesh);


		var appleGeo = THREE.BufferGeometryUtils.mergeBufferGeometries(apples);
		var applesMesh = new THREE.Mesh(appleGeo,new THREE.MeshPhongMaterial({color: 0x5F0B0B}));
		scene.add(applesMesh);

		return [tree,leaf,appleGeo];

	},

	updateTreeHermite: function (trunkGeometryBuffer, leavesGeometryBuffer, applesGeometryBuffer, rootNode) {

		// Créer un stack avec tous les points du maillage
		var stack = [];
		stack.push(rootNode);

		var idx = 0;
		while (stack.length > 0) {
			var currentNode = stack.pop();

			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}

			var matNode = currentNode.matNode;

			// Pour le tronc (la première branche)
			if (currentNode.parentNode == null){

				// Pour le premier morceau du tronc, il ne faut pas changer les points qui touchent au sol
				// On a 5 faces par morceau de branche
				for (var f = 0; f < 5; f++){
					// On a deux triangles par face et on a trois points par triangle

					// En haut à gauche
					var pointHG1 = new THREE.Vector3(trunkGeometryBuffer[f*18 +6], trunkGeometryBuffer[f*18 +7], trunkGeometryBuffer[f*18 +8]);
					pointHG1.applyMatrix4(matNode);

					trunkGeometryBuffer[f*18 +6] = pointHG1.x;
					trunkGeometryBuffer[f*18 +7] = pointHG1.y;
					trunkGeometryBuffer[f*18 +8] = pointHG1.z;

					// En haut à droite
					var pointHD = new THREE.Vector3(trunkGeometryBuffer[f*18 +12], trunkGeometryBuffer[f*18 +13], trunkGeometryBuffer[f*18 +14]);
					pointHD.applyMatrix4(matNode);

					trunkGeometryBuffer[f*18 +12] = pointHD.x;
					trunkGeometryBuffer[f*18 +13] = pointHD.y;
					trunkGeometryBuffer[f*18 +14] = pointHD.z;

					// En haut à gauche
					var pointHG2 = new THREE.Vector3(trunkGeometryBuffer[f*18 +15], trunkGeometryBuffer[f*18 +16], trunkGeometryBuffer[f*18 +17]);
					pointHG2.applyMatrix4(matNode);

					trunkGeometryBuffer[f*18 +15] = pointHG2.x;
					trunkGeometryBuffer[f*18 +16] = pointHG2.y;
					trunkGeometryBuffer[f*18 +17] = pointHG2.z;
				}

				// Pour les 3 autres morceaux du tronc, il faut appliquer la matrice de tranformation
				for (var m = 1; m < 4; m++) {

					// On a 5 faces par morceau
					for (var f = 0; f < 5; f++){
						// On a deux triangles par face et on a trois points par triangle

						// En bas à gauche
						var pointBG = new THREE.Vector3(trunkGeometryBuffer[m*5*18 + f*18 + 0], trunkGeometryBuffer[m*5*18 + f*18 + 1], trunkGeometryBuffer[m*5*18 + f*18 + 2]);
						pointBG.applyMatrix4(matNode);

						trunkGeometryBuffer[m*5*18 + f*18 + 0] = pointBG.x;
						trunkGeometryBuffer[m*5*18 + f*18 + 1] = pointBG.y;
						trunkGeometryBuffer[m*5*18 + f*18 + 2] = pointBG.z;

						// En bas à droite
						var pointBD1 = new THREE.Vector3(trunkGeometryBuffer[m*5*18 + f*18 + 3], trunkGeometryBuffer[m*5*18 + f*18 + 4], trunkGeometryBuffer[m*5*18 + f*18 + 5]);
						pointBD1.applyMatrix4(matNode);

						trunkGeometryBuffer[m*5*18 + f*18 + 3] = pointBD1.x;
						trunkGeometryBuffer[m*5*18 + f*18 + 4] = pointBD1.y;
						trunkGeometryBuffer[m*5*18 + f*18 + 5] = pointBD1.z;

						// En haut à gauche
						var pointHG1 = new THREE.Vector3(trunkGeometryBuffer[m*5*18 + f*18 + 6], trunkGeometryBuffer[m*5*18 + f*18 + 7], trunkGeometryBuffer[m*5*18 + f*18 + 8]);
						pointHG1.applyMatrix4(matNode);

						trunkGeometryBuffer[m*5*18 + f*18 + 6] = pointHG1.x;
						trunkGeometryBuffer[m*5*18 + f*18 + 7] = pointHG1.y;
						trunkGeometryBuffer[m*5*18 + f*18 + 8] = pointHG1.z;

						// En bas à droite
						var pointBD2 = new THREE.Vector3(trunkGeometryBuffer[m*5*18 + f*18 + 9], trunkGeometryBuffer[m*5*18 + f*18 + 10], trunkGeometryBuffer[m*5*18 + f*18 + 11]);
						pointBD2.applyMatrix4(matNode);

						trunkGeometryBuffer[m*5*18 + f*18 + 9] = pointBD2.x;
						trunkGeometryBuffer[m*5*18 + f*18 + 10] = pointBD2.y;
						trunkGeometryBuffer[m*5*18 + f*18 + 11] = pointBD2.z;

						// En haut à droite
						var pointHD = new THREE.Vector3(trunkGeometryBuffer[m*5*18 + f*18 + 12], trunkGeometryBuffer[m*5*18 + f*18 + 13], trunkGeometryBuffer[m*5*18 + f*18 + 14]);
						pointHD.applyMatrix4(matNode);

						trunkGeometryBuffer[m*5*18 + f*18 + 12] = pointHD.x;
						trunkGeometryBuffer[m*5*18 + f*18 + 13] = pointHD.y;
						trunkGeometryBuffer[m*5*18 + f*18 + 14] = pointHD.z;

						// En haut à gauche
						var pointHG2 = new THREE.Vector3(trunkGeometryBuffer[m*5*18 + f*18 + 15], trunkGeometryBuffer[m*5*18 + f*18 + 16], trunkGeometryBuffer[m*5*18 + f*18 + 17]);
						pointHG2.applyMatrix4(matNode);

						trunkGeometryBuffer[m*5*18 + f*18 + 15] = pointHG2.x;
						trunkGeometryBuffer[m*5*18 + f*18 + 16] = pointHG2.y;
						trunkGeometryBuffer[m*5*18 + f*18 + 17] = pointHG2.z;

					}
				}
				idx++;
			}

			// Pour toutes les autres branches, il faut appliquer les matrices de transformation de la branche en question
			else{

				// Il y a un bug dans cette partie (les indexs du buffer sont compliqués à comprendre)

				// Pour les 4 morceaux d'une branche
				for (var m = 0; m < 4; m++) {

					// On a 5 faces par morceau
					for (var f = 0; f < 5; f++){
						// On a deux triangles par face et on a trois points par triangle

						// En bas à gauche
						var pointBG = new THREE.Vector3(trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 0], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 1], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 2]);
						pointBG.applyMatrix4(matNode);

						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 0] = pointBG.x;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 1] = pointBG.y;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 2] = pointBG.z;

						// En bas à droite
						var pointBD1 = new THREE.Vector3(trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 3], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 4], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 5]);
						pointBD1.applyMatrix4(matNode);

						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 3] = pointBD1.x;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 4] = pointBD1.y;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 5] = pointBD1.z;

						// En haut à gauche
						var pointHG1 = new THREE.Vector3(trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 6], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 7], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 8]);
						pointHG1.applyMatrix4(matNode);

						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 6] = pointHG1.x;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 7] = pointHG1.y;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 8] = pointHG1.z;

						// En bas à droite
						var pointBD2 = new THREE.Vector3(trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 9], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 10], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 11]);
						pointBD2.applyMatrix4(matNode);

						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 9] = pointBD2.x;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 10] = pointBD2.y;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 11] = pointBD2.z;

						// En haut à droite
						var pointHD = new THREE.Vector3(trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 12], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 13], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 14]);
						pointHD.applyMatrix4(matNode);

						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 12] = pointHD.x;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 13] = pointHD.y;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 14] = pointHD.z;

						// En haut à gauche
						var pointHG2 = new THREE.Vector3(trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 15], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 16], trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 17]);
						pointHG2.applyMatrix4(matNode);

						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 15] = pointHG2.x;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 16] = pointHG2.y;
						trunkGeometryBuffer[idx*4*5*18 + m*5*18 + f*18 + 17] = pointHG2.z;

					}
				}

				idx++;
			}
		}
	},

	drawTreeSkeleton: function (rootNode, scene, color = 0xffffff, matrix = new THREE.Matrix4()) {

		var stack = [];
		stack.push(rootNode);

		var points = [];

		while (stack.length > 0) {
			var currentNode = stack.pop();

			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}

			points.push(currentNode.p0);
			points.push(currentNode.p1);

		}

		var geometry = new THREE.BufferGeometry().setFromPoints(points);
		var material = new THREE.LineBasicMaterial({ color: color });
		var line = new THREE.LineSegments(geometry, material);
		line.applyMatrix4(matrix);
		scene.add(line);

		return line.geometry;
	},

	updateTreeSkeleton: function (geometryBuffer, rootNode) {

		var stack = [];
		stack.push(rootNode);

		var idx = 0;
		while (stack.length > 0) {
			var currentNode = stack.pop();

			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}
			geometryBuffer[idx * 6] = currentNode.p0.x;
			geometryBuffer[idx * 6 + 1] = currentNode.p0.y;
			geometryBuffer[idx * 6 + 2] = currentNode.p0.z;
			geometryBuffer[idx * 6 + 3] = currentNode.p1.x;
			geometryBuffer[idx * 6 + 4] = currentNode.p1.y;
			geometryBuffer[idx * 6 + 5] = currentNode.p1.z;

			idx++;
		}
	},


	drawTreeNodes: function (rootNode, scene, color = 0x00ff00, size = 0.05, matrix = new THREE.Matrix4()) {

		var stack = [];
		stack.push(rootNode);

		var points = [];

		while (stack.length > 0) {
			var currentNode = stack.pop();

			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}

			points.push(currentNode.p0);
			points.push(currentNode.p1);

		}

		var geometry = new THREE.BufferGeometry().setFromPoints(points);
		var material = new THREE.PointsMaterial({ color: color, size: size });
		var points = new THREE.Points(geometry, material);
		points.applyMatrix4(matrix);
		scene.add(points);

	},


	drawTreeSegments: function (rootNode, scene, lineColor = 0xff0000, segmentColor = 0xffffff, orientationColor = 0x00ff00, matrix = new THREE.Matrix4()) {

		var stack = [];
		stack.push(rootNode);

		var points = [];
		var pointsS = [];
		var pointsT = [];

		while (stack.length > 0) {
			var currentNode = stack.pop();

			for (var i = 0; i < currentNode.childNode.length; i++) {
				stack.push(currentNode.childNode[i]);
			}

			const segments = currentNode.sections;
			for (var i = 0; i < segments.length - 1; i++) {
				points.push(TP3.Geometry.meanPoint(segments[i]));
				points.push(TP3.Geometry.meanPoint(segments[i + 1]));
			}
			for (var i = 0; i < segments.length; i++) {
				pointsT.push(TP3.Geometry.meanPoint(segments[i]));
				pointsT.push(segments[i][0]);
			}

			for (var i = 0; i < segments.length; i++) {

				for (var j = 0; j < segments[i].length - 1; j++) {
					pointsS.push(segments[i][j]);
					pointsS.push(segments[i][j + 1]);
				}
				pointsS.push(segments[i][0]);
				pointsS.push(segments[i][segments[i].length - 1]);
			}
		}

		var geometry = new THREE.BufferGeometry().setFromPoints(points);
		var geometryS = new THREE.BufferGeometry().setFromPoints(pointsS);
		var geometryT = new THREE.BufferGeometry().setFromPoints(pointsT);

		var material = new THREE.LineBasicMaterial({ color: lineColor });
		var materialS = new THREE.LineBasicMaterial({ color: segmentColor });
		var materialT = new THREE.LineBasicMaterial({ color: orientationColor });

		var line = new THREE.LineSegments(geometry, material);
		var lineS = new THREE.LineSegments(geometryS, materialS);
		var lineT = new THREE.LineSegments(geometryT, materialT);

		line.applyMatrix4(matrix);
		lineS.applyMatrix4(matrix);
		lineT.applyMatrix4(matrix);

		scene.add(line);
		scene.add(lineS);
		scene.add(lineT);

	},
	createRoundApple : function (scene,currentNode,alpha){
		let geometry = new THREE.SphereBufferGeometry(alpha/2);
		let tm = new THREE.Matrix4().makeTranslation(currentNode.p1.x, currentNode.p1.y -0.1, currentNode.p1.z);
		geometry.applyMatrix4(tm);
		return geometry;
	},

	createRandomLeaf :function(geo,currentNode,alpha) {

		geo.rotateX(THREE.MathUtils.randFloat(0, 2 * Math.PI));
		geo.rotateY(THREE.MathUtils.randFloat(0, 2 * Math.PI));
		geo.rotateZ(THREE.MathUtils.randFloat(0, 2 * Math.PI));


		let x_rand = THREE.MathUtils.randFloat(-alpha / 2, alpha / 2);
		let y_rand = THREE.MathUtils.randFloat(-alpha / 2, alpha / 2);
		let z_rand = THREE.MathUtils.randFloat(-alpha / 2, alpha / 2);
		let translation = new THREE.Matrix4().makeTranslation(x_rand, y_rand, z_rand);

		geo.applyMatrix4(translation);

		return geo;
	},
}