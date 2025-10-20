/*
 * 编译和链接着色器程序
 */
function initShaders(gl, vShaderId, fShaderId) {
    // 根据ID获取着色器源码
    const vShaderSource = document.getElementById(vShaderId).text;
    const fShaderSource = document.getElementById(fShaderId).text;

    // 编译着色器
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fShaderSource);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // 创建并链接着色器程序
    const program = gl.createProgram();
    if (!program) {
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 检查链接结果
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        const error = gl.getProgramInfoLog(program);
        console.error('着色器程序链接失败: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

// 编译单个着色器（增加详细错误日志）
function compileShader(gl, type, source) {
    // 创建着色器对象
    const shader = gl.createShader(type);
    if (shader === null) {
        console.error('无法创建着色器对象');
        return null;
    }

    // 绑定源码并编译
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // 检查编译结果（打印详细错误信息）
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        const shaderType = type === gl.VERTEX_SHADER ? '顶点着色器' : '片段着色器';
        const error = gl.getShaderInfoLog(shader);
        console.error(`【${shaderType}编译失败】\n错误信息: ${error}\n源码:\n${source}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}