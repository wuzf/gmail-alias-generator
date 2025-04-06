const assert = require("assert/strict");
const generator = require("./public/alias-generator.js");

{
  assert.equal(generator.normalizeUsername("demo@gmail.com"), "demo");
  assert.equal(generator.normalizeUsername("demo@googlemail.com"), "demo");
  assert.equal(generator.normalizeUsername(" demo.name "), "demo.name");
}

{
  assert.equal(generator.isValidUsername("demo.name"), true);
  assert.equal(generator.isValidUsername("demo_name"), true);
  assert.equal(generator.isValidUsername("demo-name"), false);
}

{
  const rng = generator.createSeededRandom(42);
  const result = generator.generateAliases({
    username: "demo",
    count: 20,
    enabledRules: ["dot", "plus", "case", "domain"],
    rng,
  });

  assert.equal(result.aliases.length, 20);
  assert.ok(result.aliases.includes("demo@gmail.com"));
  assert.ok(result.aliases.some((alias) => alias.includes("+")));
}

{
  const rng = generator.createSeededRandom(7);
  const result = generator.generateAliases({
    username: "ab",
    count: 10,
    enabledRules: ["domain"],
    rng,
  });

  assert.ok(result.aliases.length <= 2);
  assert.ok(result.aliases.includes("ab@gmail.com"));
}

{
  const dotVariations = generator.enumerateDotVariations("wzf1020");
  assert.equal(dotVariations.length, 64);
  assert.ok(dotVariations.includes("w.z.f1020"));
  assert.ok(dotVariations.includes("w.z.f.1.0.2.0"));
}

{
  const rng = generator.createSeededRandom(11);
  const result = generator.generateAliases({
    username: "wzf1020",
    count: 100,
    enabledRules: ["dot"],
    rng,
  });

  assert.equal(result.aliases.length, 64);
  assert.ok(result.aliases.includes("w.z.f1020@gmail.com"));
  assert.ok(result.aliases.includes("w.z.f.1.0.2.0@gmail.com"));
}

console.log("All alias generator smoke tests passed.");
