// Raw-WebGL renderer for the hero word: two words drawn from a 2D canvas dissolve into each other.
// The fill is solid ink; a thin orange seam shows only while the swap is running.

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0); m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){ float f=0.0; float a=0.5; for(int i=0;i<4;i++){ f+=a*snoise(p); p*=2.02; a*=0.5; } return f; }
`;

const VERT = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.0,1.0); }`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uA; uniform sampler2D uB;
uniform vec2 uRes; uniform float uTime; uniform float uMix; uniform float uReveal;
uniform vec2 uLens; uniform float uLensR; uniform float uLensA;
${NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 tuv = vec2(uv.x, 1.0 - uv.y);
  float n = fbm(uv * vec2(5.0, 1.6) + vec2(uTime * 0.08, 0.0)) * 0.5 + 0.5;
  float swing = 1.0 - abs(uMix * 2.0 - 1.0);
  vec2 off = vec2(0.0, (n - 0.5) * 0.16 * swing);
  float a = texture2D(uA, tuv + off).a;
  float b = texture2D(uB, tuv - off).a;
  float t = smoothstep(n - 0.1, n + 0.1, uMix * 1.2 - 0.1);
  float mask = mix(a, b, t);
  float seam = (1.0 - smoothstep(0.0, 0.14, abs(t - 0.5))) * swing;
  // intro wipe from the bottom: uReveal runs 1.4 (hidden) -> -0.4 (shown)
  mask *= smoothstep(uReveal - 0.25, uReveal, 1.0 - uv.y + n * 0.2);
  vec3 ink = vec3(0.043, 0.047, 0.055);
  vec3 col = mix(ink, vec3(1.0, 0.353, 0.122), seam * 0.95);
  vec4 base = vec4(col * mask, mask);
  // hover lens: inside the circle the word inverts (paper letters on an ink disc).
  // It is drawn here, under the portrait, so the photo always covers it.
  float d = length(gl_FragCoord.xy - uLens);
  float lens = (1.0 - smoothstep(uLensR - 1.5, uLensR + 1.5, d)) * uLensA;
  vec4 inv = vec4(mix(ink, vec3(0.953, 0.949, 0.937), mask), 1.0);
  gl_FragColor = mix(base, inv, lens);
}
`;

export class InkWord {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private texA: WebGLTexture | null = null;
  private texB: WebGLTexture | null = null;
  private raf = 0;
  private start = performance.now();
  private visible = true;
  private io?: IntersectionObserver;
  mix = 0;
  reveal = -0.4;
  /** Lens state in CSS px relative to the canvas; `active` fades it in and out. */
  lens = { x: 0, y: 0, tx: 0, ty: 0, a: 0, active: 0, r: 75 };

  static supported() {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) throw new Error("no webgl");
    this.gl = gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.prog = prog;
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uA", "uB", "uRes", "uTime", "uMix", "uReveal", "uLens", "uLensR", "uLensA"]) this.u[n] = gl.getUniformLocation(prog, n);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.io = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting), { rootMargin: "100px" });
    this.io.observe(canvas);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width * dpr));
    const h = Math.max(2, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
  }

  /** Moves the lens target; clientX/Y in viewport px. */
  pointer(clientX: number, clientY: number, active: boolean) {
    const r = this.canvas.getBoundingClientRect();
    this.lens.tx = clientX - r.left;
    this.lens.ty = clientY - r.top;
    if (active && this.lens.active === 0) {
      this.lens.x = this.lens.tx;
      this.lens.y = this.lens.ty;
    }
    this.lens.active = active ? 1 : 0;
  }

  /**
   * Draws both words at one shared size so the swap stays aligned.
   * `padPx` is the empty margin (CSS px) around the word, so the lens is not clipped at the edges.
   */
  setWords(a: string, b: string, family: string, padPx = 0) {
    const dpr = this.canvas.width / Math.max(1, this.canvas.getBoundingClientRect().width);
    const pad = padPx * dpr;
    const w = this.canvas.width - pad * 2;
    const h = this.canvas.height - pad * 2;
    const measure = document.createElement("canvas").getContext("2d")!;
    const fit = (word: string) => {
      measure.font = `400 100px ${family}`;
      const m = measure.measureText(word);
      const capH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      return Math.min((w * 0.995) / m.width, (h * 0.96) / capH) * 100;
    };
    const size = Math.min(fit(a), fit(b));
    const draw = (word: string) => {
      const c = document.createElement("canvas");
      c.width = this.canvas.width;
      c.height = this.canvas.height;
      const ctx = c.getContext("2d")!;
      ctx.font = `400 ${size}px ${family}`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const m = ctx.measureText(word);
      const capH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      ctx.fillText(word, c.width / 2, c.height / 2 + capH / 2 - m.actualBoundingBoxDescent);
      return c;
    };
    this.texA = this.upload(draw(a), this.texA);
    this.texB = this.upload(draw(b), this.texB);
  }

  private upload(src: HTMLCanvasElement, tex: WebGLTexture | null) {
    const gl = this.gl;
    const t = tex ?? gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  run() {
    const gl = this.gl;
    const frame = () => {
      this.raf = requestAnimationFrame(frame);
      if (!this.visible || document.hidden) return;
      gl.useProgram(this.prog);
      gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.u.uTime, (performance.now() - this.start) / 1000);
      gl.uniform1f(this.u.uMix, this.mix);
      gl.uniform1f(this.u.uReveal, this.reveal);
      const L = this.lens;
      L.x += (L.tx - L.x) * 0.2;
      L.y += (L.ty - L.y) * 0.2;
      L.a += (L.active - L.a) * 0.14;
      const dpr = this.canvas.width / Math.max(1, this.canvas.clientWidth);
      gl.uniform2f(this.u.uLens, L.x * dpr, this.canvas.height - L.y * dpr);
      gl.uniform1f(this.u.uLensR, L.r * dpr * (0.6 + 0.4 * L.a));
      gl.uniform1f(this.u.uLensA, L.a);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texA);
      gl.uniform1i(this.u.uA, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.texB);
      gl.uniform1i(this.u.uB, 1);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    frame();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.io?.disconnect();
    // Don't force-lose the context: React dev remounts reuse the same canvas.
    if (this.texA) this.gl.deleteTexture(this.texA);
    if (this.texB) this.gl.deleteTexture(this.texB);
    this.gl.deleteProgram(this.prog);
  }
}
