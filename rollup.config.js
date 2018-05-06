import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

export default {
    input: "src/index.js",
    output: {
        file: "dist/sara.js",
        format: "umd",
        name: "sara"
    },
    plugins: [
        babel({
            exclude: "node_modules/**" // 只编译我们的源代码
        }),
        uglify()
    ]
};
