import { red } from "https://deno.land/std/fmt/colors.ts";
import { exists } from "https://deno.land/std/fs/exists.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";

if (Deno.args.length === 0) {
  console.error(red("pass me some args dawg"));
}

const [firstArg, ...rest] = Deno.args;

if (typeof firstArg === "string" && await exists(firstArg)) {
  const fileContent = await readFileStr(firstArg);
  const fileArray = fileContent.trim().split("\n");
  for await (const result of convertArray(fileArray)) {
    console.log(result);
  }
} else {
  console.log("nothing");
}
