import { version as v } from "../../package.json";

/* print out the package version */
export default function version() {
    console.log(`v${v}`);
}