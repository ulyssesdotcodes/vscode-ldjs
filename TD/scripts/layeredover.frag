// uniform float exampleUniform;

out vec4 fragColor;
void main()
{
  vec2 uv = uTDOutputInfo.res.zw * vUV.xy;
  vec4 color = vec4(0);
  float mult = 0;
  float soFar = 0;
  for(int i = 0; i < TD_NUM_2D_INPUTS; ++i) {
    mult = step(uv.y, soFar);
    color += texelFetch(sTD2DInputs[i], ivec2(uv) - ivec2(0, soFar), 0) * mult;
    soFar += uTD2DInfos[i].res.z;
  }

  fragColor = color;
}
