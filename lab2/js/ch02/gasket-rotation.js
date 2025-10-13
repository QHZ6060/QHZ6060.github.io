const gasketRotation = {
    /**
     * 生成线框模式的Sierpinski Gasket（用于整体旋转）
     * @param {number} level - 递归层级
     * @returns {Object} 包含顶点数组和颜色数组的对象
     */
    generate(level) {
        const vertices = [];
        const colors = [];
        
        // 定义大三角形的三个顶点
        const triangle = [
            [-0.8, 0.8, 0.0],   // 左上
            [0.8, 0.8, 0.0],    // 右上
            [0.0, -0.8, 0.0]    // 底部
        ];
        
        // 线框颜色（蓝色）
        const lineColor = [0.0, 0.0, 1.0, 1.0];
        
        // 递归生成线框Sierpinski Gasket
        this.recurse(triangle[0], triangle[1], triangle[2], 
                    level, vertices, colors, lineColor);
        
        return { vertices, colors };
    },
    
    /**
     * 递归函数，生成线框Sierpinski Gasket的分形结构
     * @param {Array} a - 三角形顶点a
     * @param {Array} b - 三角形顶点b
     * @param {Array} c - 三角形顶点c
     * @param {number} level - 当前递归层级
     * @param {Array} vertices - 存储顶点的数组
     * @param {Array} colors - 存储颜色的数组
     * @param {Array} lineColor - 线框颜色
     */
    recurse(a, b, c, level, vertices, colors, lineColor) {
        // 添加当前三角形的三条边（每条边用两个点表示）
        this.addLine(a, b, vertices, colors, lineColor);
        this.addLine(b, c, vertices, colors, lineColor);
        this.addLine(c, a, vertices, colors, lineColor);
        
        if (level === 0) {
            // 递归终止条件
            return;
        }
        
        // 计算各边中点
        const abMid = this.midpoint(a, b);
        const bcMid = this.midpoint(b, c);
        const caMid = this.midpoint(c, a);
        
        // 递归生成三个子三角形
        this.recurse(a, abMid, caMid, level - 1, vertices, colors, lineColor);
        this.recurse(abMid, b, bcMid, level - 1, vertices, colors, lineColor);
        this.recurse(caMid, bcMid, c, level - 1, vertices, colors, lineColor);
    },
    
    /**
     * 添加一条线段到顶点和颜色数组
     * @param {Array} p1 - 线段起点
     * @param {Array} p2 - 线段终点
     * @param {Array} vertices - 存储顶点的数组
     * @param {Array} colors - 存储颜色的数组
     * @param {Array} color - 线段颜色
     */
    addLine(p1, p2, vertices, colors, color) {
        vertices.push(...p1, ...p2);
        colors.push(...color, ...color);
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
    }
};
