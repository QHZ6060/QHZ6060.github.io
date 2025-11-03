
// 全局变量
let selectedObject = null;
const allCubes = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// 场景1：左侧黑色画布（3D立方体区域）
const scene1 = new THREE.Scene();
scene1.background = new THREE.Color(0x000000);
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
const renderer1 = new THREE.WebGLRenderer({ antialias: true });
renderer1.setSize(window.innerWidth / 2, window.innerHeight);
document.getElementById('scene1').appendChild(renderer1.domElement);

// 场景2：右侧白色画布（2D图形区域）
const scene2 = new THREE.Scene();
scene2.background = new THREE.Color(0xffffff);
const aspect = (window.innerWidth / 2) / window.innerHeight;
const camera2 = new THREE.OrthographicCamera(-5 * aspect, 5 * aspect, 5, -5, 0.1, 1000);
camera2.position.z = 10;
const renderer2 = new THREE.WebGLRenderer({ antialias: true });
renderer2.setSize(window.innerWidth / 2, window.innerHeight);
document.getElementById('scene2').appendChild(renderer2.domElement);

// 初始化坐标轴和刻度
function initAxes() {
    const axesHelper = new THREE.AxesHelper(10);
    scene1.add(axesHelper);

    function createTicks(axis, length, color) {
        for (let i = 1; i <= length; i++) {
            let tickGeometry;
            if (axis === 'x') {
                tickGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(i, 0.1, 0),
                    new THREE.Vector3(i, -0.1, 0)
                ]);
            } else if (axis === 'y') {
                tickGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0.1, i, 0),
                    new THREE.Vector3(-0.1, i, 0)
                ]);
            } else {
                tickGeometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0.1, 0, i),
                    new THREE.Vector3(-0.1, 0, i)
                ]);
            }
            const tick = new THREE.Line(tickGeometry, new THREE.LineBasicMaterial({ color }));
            scene1.add(tick);
            addAxisLabel(i, axis);
        }
    }

    createTicks('x', 10, 0xff0000);
    createTicks('y', 10, 0x00ff00);
    createTicks('z', 10, 0x0000ff);
}

function addAxisLabel(value, axis) {
    const div = document.createElement('div');
    div.className = 'axis-label';
    div.style.color = axis === 'x' ? 'red' : axis === 'y' ? 'lime' : 'blue';
    div.style.fontSize = '12px';
    div.textContent = `${axis.toUpperCase()}=${value}`;
    document.body.appendChild(div);

    function updatePosition() {
        let pos = new THREE.Vector3(0, 0, 0);
        if (axis === 'x') pos.set(value, 0, 0);
        else if (axis === 'y') pos.set(0, value, 0);
        else pos.set(0, 0, value);

        pos.project(camera1);
        const canvas = renderer1.domElement;
        const x = (pos.x * 0.5 + 0.5) * canvas.clientWidth + canvas.offsetLeft;
        const y = (-pos.y * 0.5 + 0.5) * canvas.clientHeight + canvas.offsetTop;
        div.style.left = `${x + 5}px`;
        div.style.top = `${y}px`;
    }

    function animate() {
        updatePosition();
        requestAnimationFrame(animate);
    }
    animate();
}

// 初始化左侧3D场景
function initScene1() {
    initAxes();
    camera1.position.set(8, 8, 8);
    camera1.lookAt(0, 0, 0);

    const controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
    controls1.enableDamping = true;

    renderer1.domElement.addEventListener('click', (e) => {
        const rect = renderer1.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera1);

        const intersects = raycaster.intersectObjects(allCubes);
        if (selectedObject) {
            selectedObject.material.color.set(selectedObject.userData.originalColor);
        }

        if (intersects.length > 0) {
            selectedObject = intersects[0].object;
            selectedObject.userData.originalColor = selectedObject.material.color.getHex();
            selectedObject.material.color.set(0xffff00);
            document.getElementById('selected-info').textContent = 
                `位置: X=${selectedObject.position.x.toFixed(1)}, Y=${selectedObject.position.y.toFixed(1)}, Z=${selectedObject.position.z.toFixed(1)}`;
        } else {
            selectedObject = null;
            document.getElementById('selected-info').textContent = '未选中物体';
        }
    });
}

// 添加立方体
function addNewCube() {
    const color = document.getElementById('color-picker').value;
    const hexColor = parseInt(color.replace('#', '0x'), 16);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
    );

    scene1.add(cube);
    allCubes.push(cube);
}

// 初始化控件交互
function initControls() {
    document.getElementById('add-cube').addEventListener('click', addNewCube);

    document.querySelectorAll('.left-controls button[data-axis]').forEach(button => {
        button.addEventListener('click', () => {
            if (!selectedObject) return;

            const axis = button.dataset.axis;
            const action = button.dataset.action;
            const step = 0.5;

            if (action.includes('translate')) {
                selectedObject.position[axis] += action.includes('+') ? step : -step;
            } else if (action.includes('scale')) {
                selectedObject.scale[axis] *= action.includes('+') ? 1.2 : 0.8;
            }

            document.getElementById('selected-info').textContent = 
                `位置: X=${selectedObject.position.x.toFixed(1)}, Y=${selectedObject.position.y.toFixed(1)}, Z=${selectedObject.position.z.toFixed(1)}`;
        });
    });

    document.getElementById('clear-scene').addEventListener('click', () => {
        allCubes.forEach(cube => scene1.remove(cube));
        allCubes.length = 0;
        selectedObject = null;
        document.getElementById('selected-info').textContent = '未选中物体';

        objects2.forEach(obj => scene2.remove(obj));
        objects2.length = 0;
        for (let key in animations) animations[key] = [];
    });
}

// 右侧2D场景逻辑（重点修复）
const objects2 = [];
const animations = { triangle: [], square: [], circle: [], cube: [] };

function initScene2() {
    // 修复右侧画布点击事件（确保坐标计算正确）
    const scene2Element = document.getElementById('scene2');
    scene2Element.addEventListener('click', (e) => {
        // 获取右侧画布的绝对位置
        const rect = renderer2.domElement.getBoundingClientRect();
        
        // 计算点击在右侧画布内的相对坐标
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 转换为标准化设备坐标 (NDC)
        mouse.x = (x / rect.width) * 2 - 1;
        mouse.y = -(y / rect.height) * 2 + 1;

        // 射线检测计算3D位置
        raycaster.setFromCamera(mouse, camera2);
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0平面
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);

        // 创建选中的图形
        const shape = document.getElementById('shape-select').value;
        const color = document.getElementById('color-picker').value;
        createShape(shape, point.x, point.y, color);
    });

    // 圆边数控制
    document.getElementById('circle-sides').addEventListener('input', (e) => {
        const sides = parseInt(e.target.value);
        objects2.forEach(obj => {
            if (obj.userData.type === 'circle') {
                obj.geometry.dispose();
                obj.geometry = new THREE.RegularPolygonGeometry(0.5, sides);
            }
        });
    });
}

// 修复图形创建函数（确保所有图形类型都能正确生成）
function createShape(type, x, y, color) {
    const hexColor = parseInt(color.replace('#', '0x'), 16);
    let geometry, material, mesh;

    // 白色背景使用深色材质，确保可见
    material = new THREE.MeshBasicMaterial({
        color: hexColor,
        wireframe: true
    });

    switch (type) {
        case 'cube':
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, 0);
            animations.cube.push({
                mesh,
                axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                speed: 0.02
            });
            break;
        case 'triangle':
            // 正三角形几何体修复
            geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0.5, 0),    // 上顶点
                new THREE.Vector3(-0.433, -0.25, 0), // 左下顶点
                new THREE.Vector3(0.433, -0.25, 0)  // 右下顶点
            ]);
            // 使用LineLoop确保三角形闭合
            material = new THREE.LineBasicMaterial({ color: hexColor });
            mesh = new THREE.LineLoop(geometry, material);
            mesh.position.set(x, y, 0);
            animations.triangle.push({ mesh, scale: 1, dir: 1 });
            break;
        case 'square':
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0); // 扁平立方体模拟正方形
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, 0);
            animations.square.push({ mesh, rot: 0 });
            break;
        case 'circle':
            const sides = parseInt(document.getElementById('circle-sides').value);
            // 使用LineLoop绘制圆形
            geometry = new THREE.RingGeometry(0.4, 0.5, sides); // 环形几何体确保轮廓可见
            material = new THREE.MeshBasicMaterial({ 
                color: hexColor, 
                wireframe: true,
                side: THREE.DoubleSide
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, 0);
            animations.circle.push({
                mesh,
                dir: new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5).normalize()
            });
            break;
    }

    if (mesh) {
        mesh.userData.type = type;
        objects2.push(mesh);
        scene2.add(mesh);
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    // 三角形动画（缩放）
    animations.triangle.forEach(anim => {
        anim.scale += anim.dir * 0.01;
        if (anim.scale > 1.5 || anim.scale < 0.5) anim.dir *= -1;
        anim.mesh.scale.set(anim.scale, anim.scale, 1);
    });

    // 正方形动画（旋转）
    animations.square.forEach(anim => {
        anim.rot += 0.02;
        anim.mesh.rotation.z = anim.rot;
    });

    // 圆形动画（平移）
    animations.circle.forEach(anim => {
        anim.mesh.position.x += anim.dir.x * 0.03;
        anim.mesh.position.y += anim.dir.y * 0.03;
        const bounds = 4.5;
        if (Math.abs(anim.mesh.position.x) > bounds) anim.dir.x *= -1;
        if (Math.abs(anim.mesh.position.y) > bounds) anim.dir.y *= -1;
    });

    // 立方体动画（旋转）
    animations.cube.forEach(anim => {
        anim.mesh.rotateOnAxis(anim.axis, anim.speed);
    });

    renderer1.render(scene1, camera1);
    renderer2.render(scene2, camera2);
}

// 窗口大小调整
window.addEventListener('resize', () => {
    camera1.aspect = window.innerWidth / 2 / window.innerHeight;
    camera1.updateProjectionMatrix();
    renderer1.setSize(window.innerWidth / 2, window.innerHeight);

    const newAspect = (window.innerWidth / 2) / window.innerHeight;
    camera2.left = -5 * newAspect;
    camera2.right = 5 * newAspect;
    camera2.updateProjectionMatrix();
    renderer2.setSize(window.innerWidth / 2, window.innerHeight);
});

// 初始化
initScene1();
initScene2();
initControls();
animate();
