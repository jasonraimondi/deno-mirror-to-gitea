const { test } = Deno;
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { mergeBody } from "./api/gitea.js";

test("mergeBody", function (): void {
  const result = mergeBody({
    clone_addr: "http://github.com/jasonraimondi/jasonraimondi.com",
    repo_name: "jasonraimondi__jasonraimondi.com",
  });

  assertEquals(result, {
    issues: true,
    labels: true,
    milestones: true,
    mirror: true,
    private: false,
    pull_requests: true,
    releases: true,
    wiki: true,
    uid: 2,
    clone_addr: "http://github.com/jasonraimondi/jasonraimondi.com",
    repo_name: "jasonraimondi__jasonraimondi.com",
  });
});
