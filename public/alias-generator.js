(function initAliasGenerator(globalScope) {
  const CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";

  function createSeededRandom(seed) {
    let state = Number(seed) || 1;

    return function seededRandom() {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  }

  function normalizeUsername(input) {
    const raw = String(input || "").trim();
    return raw.replace(/@(gmail|googlemail)\.com$/i, "");
  }

  function isValidUsername(username) {
    return /^[a-zA-Z0-9._]+$/.test(username) && username.length > 0;
  }

  function randomInt(min, max, rng) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function shuffleArray(values, rng) {
    const array = values.slice();
    for (let i = array.length - 1; i > 0; i -= 1) {
      const swapIndex = Math.floor(rng() * (i + 1));
      [array[i], array[swapIndex]] = [array[swapIndex], array[i]];
    }
    return array;
  }

  function randomPlusTag(rng) {
    let value = "";
    const length = randomInt(3, 7, rng);

    for (let index = 0; index < length; index += 1) {
      value += CHARACTERS.charAt(Math.floor(rng() * CHARACTERS.length));
    }

    return value;
  }

  function applyCaseVariation(value, rng) {
    return value
      .split("")
      .map((character) => {
        if (!/[a-z]/i.test(character)) {
          return character;
        }

        return rng() > 0.5 ? character.toUpperCase() : character.toLowerCase();
      })
      .join("");
  }

  function enumerateDotVariations(value, limit) {
    const safeLimit =
      Number.isFinite(limit) && limit !== undefined
        ? Math.max(0, Math.floor(limit))
        : Number.POSITIVE_INFINITY;

    if (safeLimit === 0) {
      return [];
    }

    if (value.length <= 1) {
      return [value];
    }

    const results = [];

    function visit(index, current) {
      if (results.length >= safeLimit) {
        return;
      }

      if (index >= value.length) {
        results.push(current);
        return;
      }

      visit(index + 1, `${current}${value[index]}`);

      if (results.length >= safeLimit) {
        return;
      }

      visit(index + 1, `${current}.${value[index]}`);
    }

    visit(1, value[0]);
    return results;
  }

  function applyDotVariation(value, rng) {
    if (value.length <= 1) {
      return value;
    }

    let result = value[0];
    for (let index = 1; index < value.length; index += 1) {
      if (rng() > 0.5) {
        result += ".";
      }
      result += value[index];
    }

    return result;
  }

  function generateAliases(options) {
    const settings = options || {};
    const rng = typeof settings.rng === "function" ? settings.rng : Math.random;
    const normalizedUsername = normalizeUsername(settings.username);
    const count = Math.max(1, Number(settings.count) || 10);
    const enabledRules = new Set(settings.enabledRules || []);

    if (!isValidUsername(normalizedUsername)) {
      return {
        aliases: [],
        normalizedUsername,
      };
    }

    const baseUsername = enabledRules.has("plus")
      ? normalizedUsername.replace(/\.+/g, "")
      : normalizedUsername;
    const dotVariants = enabledRules.has("dot")
      ? shuffleArray(enumerateDotVariations(baseUsername, count), rng)
      : [baseUsername];

    const results = new Set([`${normalizedUsername}@gmail.com`]);
    const maxAttempts = Math.max(count * 30, 5000);

    for (let attempt = 0; results.size < count && attempt < maxAttempts; attempt += 1) {
      let baseAlias = dotVariants[attempt % dotVariants.length] || baseUsername;
      const plusPart = enabledRules.has("plus") ? `+${randomPlusTag(rng)}` : "";

      if (enabledRules.has("case")) {
        baseAlias = applyCaseVariation(baseAlias, rng);
      }

      const domain =
        enabledRules.has("domain") && rng() > 0.5 ? "googlemail.com" : "gmail.com";

      results.add(`${baseAlias}${plusPart}@${domain}`);
    }

    return {
      aliases: Array.from(results).slice(0, count),
      normalizedUsername,
    };
  }

  const api = {
    applyCaseVariation,
    applyDotVariation,
    createSeededRandom,
    enumerateDotVariations,
    generateAliases,
    isValidUsername,
    normalizeUsername,
    randomPlusTag,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.GmailAliasGenerator = api;
})(typeof window !== "undefined" ? window : globalThis);
