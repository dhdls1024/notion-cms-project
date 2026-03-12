import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // SSR hydration 불일치 방지용 마운트 패턴 허용
      // useEffect(() => { setMounted(true) }, []) 는 Next.js에서 공식 권장하는
      // 클라이언트 전용 렌더링 패턴으로 의도된 사용임
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
