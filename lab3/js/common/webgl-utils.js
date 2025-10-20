/*
 * 提供WebGL上下文初始化、动画帧兼容等基础工具
 */
(function(global) {
    // 初始化WebGL上下文
    function getWebGLContext(canvas, options) {
        const gl = canvas.getContext('webgl2', options) || 
                   canvas.getContext('webgl', options) ||
                   canvas.getContext('experimental-webgl', options);
        if (!gl) {
            alert('无法获取WebGL上下文，请升级浏览器');
        }
        return gl;
    }

    // 兼容不同浏览器的requestAnimationFrame
    const requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               function(callback) {
                   window.setTimeout(callback, 1000/60);
               };
    })();

    // 清除画布
    function clear(gl, color) {
        if (color) {
            gl.clearColor(color[0], color[1], color[2], color[3]);
        }
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    // 导出工具函数
    global.webglUtils = {
        getWebGLContext: getWebGLContext,
        requestAnimFrame: requestAnimFrame,
        clear: clear
    };
})(window);