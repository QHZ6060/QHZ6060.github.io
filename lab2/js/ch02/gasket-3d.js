const gasket3D = {
    /**
     * 生成3D Sierpinski Gasket的顶点和颜色数据
     * @param {number} level - 递归层级
     * @returns {Object} 包含顶点数组和颜色数组的对象
     */
    generate(level) {
        const vertices = [];
        const colors = [];
        
        // 定义3D四面体的四个顶点
        const tetrahedron = [
            [0.0,  0.0,  1.0],   // 顶部
            [0.0,  0.9428, -0.3333], // 前下
            [-0.8165, -0.4714, -0.3333], // 左下
            [0.8165, -0.4714, -0.3333]  // 右下
        ];
        
        // 定义四个顶点的颜色
        const color1 = [1.0, 0.0, 0.0, 1.0]; // 红色
        const color2 = [0.0, 1.0, 0.0, 1.0]; // 绿色
        const color3 = [0.0, 0.0, 1.0, 1.0]; // 蓝色
        const color4 = [1.0, 1.0, 0.0, 1.0]; // 黄色
        
        // 从四面体的四个面递归生成
        this.recurse(
            tetrahedron[0], tetrahedron[1], tetrahedron[2], 
            color1, color2, color3, level, vertices, colors
        );
        this.recurse(
            tetrahedron[0], tetrahedron[2], tetrahedron[3], 
            color1, color3, color4, level, vertices, colors
        );
        this.recurse(
            tetrahedron[0], tetrahedron[3], tetrahedron[1], 
            color1, color4, color2, level, vertices, colors
        );
        this.recurse(
            tetrahedron[1], tetrahedron[3], tetrahedron[2], 
            color2, color4, color3, level, vertices, colors
        );
        
        return { vertices, colors };
    },
    
    /**
     * 递归函数，生成3D Sierpinski Gasket的分形结构
     * @param {Array} a - 三角形顶点a
     * @param {Array} b - 三角形顶点b
     * @param {Array} c - 三角形顶点c
     * @param {Array} colorA - 顶点a的颜色
     * @param {Array} colorB - 顶点b的颜色
     * @param {Array} colorC - 顶点c的颜色
     * @param {number} level - 当前递归层级
     * @param {Array} vertices - 存储顶点的数组
     * @param {Array} colors - 存储颜色的数组
     */
    recurse(a, b, c, colorA, colorB, colorC, level, vertices, colors) {
        if (level === 0) {
            // 递归终止，添加当前三角形的顶点和颜色
            vertices.push(...a, ...b, ...c);
            colors.push(...colorA, ...colorB, ...colorC);
            return;
        }
        
        // 计算各边中点
        const abMid = this.midpoint(a, b);
        const bcMid = this.midpoint(b, c);
        const caMid = this.midpoint(c, a);
        
        // 计算中点颜色（插值）
        const colorAB = this.interpolateColor(colorA, colorB);
        const colorBC = this.interpolateColor(colorB, colorC);
        const colorCA = this.interpolateColor(colorC, colorA);
        
        // 递归生成三个子三角形
        this.recurse(a, abMid, caMid, colorA, colorAB, colorCA, level - 1, vertices, colors);
        this.recurse(abMid, b, bcMid, colorAB, colorB, colorBC, level - 1, vertices, colors);
        this.recurse(caMid, bcMid, c, colorCA, colorBC, colorC, level - 1, vertices, colors);
    },
    
    /**
     * 计算两点的中点
     * @param {Array} p1 - 第一个点
     * @param {Array} p2 - 第二个点
     * @returns {Array} 中点坐标
     */
    midpoint(p1, p2) {
        return [
            (p1[0] + p2[0]) / 2,
            (p1[1] + p2[1]) / 2,
            (p1[2] + p2[2]) / 2
        ];
    },
    
    /**
     * 计算两种颜色的插值
     * @param {Array} c1 - 第一种颜色
     * @param {Array} c2 - 第二种颜色
     * @returns {Array} 插值后的颜色
     */
    interpolateColor(c1, c2) {
        return [
            (c1[0] + c2[0]) / 2,
            (c1[1] + c2[1]) / 2,
            (c1[2] + c2[2]) / 2,
            (c1[3] + c2[3]) / 2
        ];
    }
};
