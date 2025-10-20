// 轻量级矩阵运算库（核心功能简化版，支持4x4矩阵基本操作）
const mat4 = {
    create: function() {
        return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    },
    identity: function(out) {
        out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
        out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
        out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
        out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
        return out;
    },
    translate: function(out, a, v) {
        const x = v[0], y = v[1], z = v[2];
        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a30;
        out[13] = a01 * x + a11 * y + a21 * z + a31;
        out[14] = a02 * x + a12 * y + a22 * z + a32;
        out[15] = a03 * x + a13 * y + a23 * z + a33;
        return out;
    },
    rotateZ: function(out, a, rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a00 * (-s) + a10 * c;
        out[5] = a01 * (-s) + a11 * c;
        out[6] = a02 * (-s) + a12 * c;
        out[7] = a03 * (-s) + a13 * c;
        out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
        out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
        return out;
    },
    scale: function(out, a, v) {
        const x = v[0], y = v[1], z = v[2];
        out[0] = a[0] * x;
        out[1] = a[1] * x;
        out[2] = a[2] * x;
        out[3] = a[3] * x;
        out[4] = a[4] * y;
        out[5] = a[5] * y;
        out[6] = a[6] * y;
        out[7] = a[7] * y;
        out[8] = a[8] * z;
        out[9] = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
    },
    multiply: function(out, a, b) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
        const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
        const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
        const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];
        out[0] = a00*b00 + a01*b10 + a02*b20 + a03*b30;
        out[1] = a00*b01 + a01*b11 + a02*b21 + a03*b31;
        out[2] = a00*b02 + a01*b12 + a02*b22 + a03*b32;
        out[3] = a00*b03 + a01*b13 + a02*b23 + a03*b33;
        out[4] = a10*b00 + a11*b10 + a12*b20 + a13*b30;
        out[5] = a10*b01 + a11*b11 + a12*b21 + a13*b31;
        out[6] = a10*b02 + a11*b12 + a12*b22 + a13*b32;
        out[7] = a10*b03 + a11*b13 + a12*b23 + a13*b33;
        out[8] = a20*b00 + a21*b10 + a22*b20 + a23*b30;
        out[9] = a20*b01 + a21*b11 + a22*b21 + a23*b31;
        out[10] = a20*b02 + a21*b12 + a22*b22 + a23*b32;
        out[11] = a20*b03 + a21*b13 + a22*b23 + a23*b33;
        out[12] = a30*b00 + a31*b10 + a32*b20 + a33*b30;
        out[13] = a30*b01 + a31*b11 + a32*b21 + a33*b31;
        out[14] = a30*b02 + a31*b12 + a32*b22 + a33*b32;
        out[15] = a30*b03 + a31*b13 + a32*b23 + a33*b33;
        return out;
    }
};

// 暴露到全局
window.mat4 = mat4;