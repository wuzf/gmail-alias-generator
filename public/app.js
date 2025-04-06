(function initApp() {
  const generator = window.GmailAliasGenerator;

  if (!generator) {
    throw new Error("GmailAliasGenerator is not available.");
  }

  const PAGE_SIZE = 200;
  const MIN_COUNT = 1;
  const MAX_COUNT = 10000;
  const DEFAULT_COUNT = 1000;
  const COUNT_STORAGE_KEY = "gmailAliasGenerator.requestedCount";
  const ALL_RULES = ["dot", "plus", "case", "domain"];

  const translations = {
    zh: {
      pageTitle: "Gmail 无限别名生成器",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "语言",
      title: "Gmail 无限别名生成器",
      subtitle: "通过点号、加号、大小写和域名组合，快速生成可用于分类收件的 Gmail 别名。",
      inputLabel: "Gmail 用户名",
      inputHint: "只输入 @ 前面的部分，例如：yourname",
      placeholder: "请输入 Gmail 用户名",
      rulesTitle: "生成规则",
      countTitle: "生成数量",
      countCustomLabel: "自定义数量",
      countInputHint: "可输入 1 - 10000",
      resultsTitle: "生成结果",
      generateButton: "生成别名",
      copyButton: "复制全部",
      copySingle: "复制",
      prevPage: "上一页",
      nextPage: "下一页",
      invalidInput: "请输入合法的 Gmail 用户名",
      invalidCount: "请输入有效的数量",
      countTooLow: `数量至少要为 ${MIN_COUNT}。`,
      countTooHigh: `单次最多支持 ${MAX_COUNT} 个；为了避免浏览器卡顿，请输入不超过 ${MAX_COUNT} 的数量。`,
      countClampedToMin: `数量至少为 ${MIN_COUNT}，已自动调整为 ${MIN_COUNT}。`,
      countClampedToMax: `为了避免浏览器卡顿，单次最多支持 ${MAX_COUNT} 个，已自动调整为 ${MAX_COUNT}。`,
      copied: "结果已复制到剪贴板",
      singleCopied: "单个邮箱已复制到剪贴板",
      copyFailed: "复制失败，请手动复制",
      partialResult: "当前规则下可生成的唯一别名数量不足，已返回全部可生成结果。",
      generatedCount: (actual, requested) => `已生成 ${actual}/${requested} 个别名`,
      countOption: (value) => `${value} 个别名`,
      pageInfo: (page, totalPages, start, end, totalItems) =>
        `第 ${page}/${totalPages} 页 · 当前显示 ${start}-${end} / ${totalItems}`,
      rules: {
        dot: { name: "点号变换", description: "在用户名中随机插入点号，例如 a.bc.def。" },
        plus: { name: "加号别名", description: "在用户名后添加 +tag，例如 yourname+shop。" },
        case: { name: "大小写变换", description: "随机切换字母大小写，例如 YoUrNaMe。" },
        domain: { name: "域名切换", description: "在 gmail.com 和 googlemail.com 之间切换。" },
      },
    },
    en: {
      pageTitle: "Gmail Infinite Alias Generator",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "Language",
      title: "Gmail Infinite Alias Generator",
      subtitle: "Generate Gmail aliases in bulk with dot, plus, case, and domain variations.",
      inputLabel: "Gmail username",
      inputHint: "Enter only the part before @, for example: yourname",
      placeholder: "Enter Gmail username",
      rulesTitle: "Generation rules",
      countTitle: "Alias count",
      countCustomLabel: "Custom count",
      countInputHint: "Enter any value from 1 to 10000",
      resultsTitle: "Generated aliases",
      generateButton: "Generate aliases",
      copyButton: "Copy all",
      copySingle: "Copy",
      prevPage: "Previous",
      nextPage: "Next",
      invalidInput: "Please enter a valid Gmail username",
      invalidCount: "Please enter a valid count",
      countTooLow: `The count must be at least ${MIN_COUNT}.`,
      countTooHigh: `The maximum per run is ${MAX_COUNT}; to avoid browser lag, please enter no more than ${MAX_COUNT}.`,
      countClampedToMin: `The minimum is ${MIN_COUNT}; it has been adjusted to ${MIN_COUNT}.`,
      countClampedToMax: `To avoid browser lag, the maximum per run is ${MAX_COUNT}; it has been adjusted to ${MAX_COUNT}.`,
      copied: "Copied to clipboard",
      singleCopied: "Email copied to clipboard",
      copyFailed: "Copy failed, please copy manually",
      partialResult: "The selected rules cannot produce enough unique aliases, so all available aliases are shown.",
      generatedCount: (actual, requested) => `${actual}/${requested} aliases generated`,
      countOption: (value) => `${value} aliases`,
      pageInfo: (page, totalPages, start, end, totalItems) =>
        `Page ${page}/${totalPages} · Showing ${start}-${end} / ${totalItems}`,
      rules: {
        dot: { name: "Dot variation", description: "Insert dots into the username, like a.bc.def." },
        plus: { name: "Plus alias", description: "Append a +tag after the username, like yourname+shop." },
        case: { name: "Case variation", description: "Randomize uppercase and lowercase letters." },
        domain: { name: "Domain switch", description: "Switch between gmail.com and googlemail.com." },
      },
    },
    es: {
      pageTitle: "Generador de Alias de Gmail",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "Idioma",
      title: "Generador de Alias de Gmail",
      subtitle: "Genera alias de Gmail con variantes de puntos, signo +, mayúsculas y dominio.",
      inputLabel: "Nombre de usuario de Gmail",
      inputHint: "Escribe solo la parte antes de @, por ejemplo: yourname",
      placeholder: "Ingresa el usuario de Gmail",
      rulesTitle: "Reglas de generación",
      countTitle: "Cantidad de alias",
      resultsTitle: "Alias generados",
      generateButton: "Generar alias",
      copyButton: "Copiar todo",
      invalidInput: "Ingresa un nombre de usuario válido de Gmail",
      copied: "Copiado al portapapeles",
      copyFailed: "No se pudo copiar; hazlo manualmente",
      partialResult: "Las reglas actuales no producen suficientes alias únicos; se muestran todos los disponibles.",
      generatedCount: (actual, requested) => `${actual}/${requested} alias generados`,
      countOption: (value) => `${value} alias`,
      rules: {
        dot: { name: "Variación con puntos", description: "Inserta puntos en el usuario, por ejemplo a.bc.def." },
        plus: { name: "Alias con +", description: "Añade un +tag al final del usuario." },
        case: { name: "Cambio de mayúsculas", description: "Alterna mayúsculas y minúsculas de forma aleatoria." },
        domain: { name: "Cambio de dominio", description: "Alterna entre gmail.com y googlemail.com." },
      },
    },
    hi: {
      pageTitle: "Gmail अनंत उपनाम जनरेटर",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "भाषा",
      title: "Gmail अनंत उपनाम जनरेटर",
      subtitle: "डॉट, प्लस, केस और डोमेन बदलाव के साथ Gmail उपनाम जल्दी बनाएं।",
      inputLabel: "Gmail उपयोगकर्ता नाम",
      inputHint: "@ से पहले वाला भाग लिखें, उदाहरण: yourname",
      placeholder: "Gmail उपयोगकर्ता नाम दर्ज करें",
      rulesTitle: "जनरेशन नियम",
      countTitle: "उपनाम संख्या",
      resultsTitle: "उत्पन्न उपनाम",
      generateButton: "उपनाम बनाएं",
      copyButton: "सभी कॉपी करें",
      invalidInput: "मान्य Gmail उपयोगकर्ता नाम दर्ज करें",
      copied: "क्लिपबोर्ड में कॉपी किया गया",
      copyFailed: "कॉपी विफल, कृपया मैन्युअली कॉपी करें",
      partialResult: "चयनित नियम पर्याप्त अद्वितीय उपनाम नहीं बना सके; उपलब्ध सभी परिणाम दिखाए गए हैं।",
      generatedCount: (actual, requested) => `${requested} में से ${actual} उपनाम बनाए गए`,
      countOption: (value) => `${value} उपनाम`,
      rules: {
        dot: { name: "डॉट बदलाव", description: "उपयोगकर्ता नाम में डॉट जोड़ें, जैसे a.bc.def." },
        plus: { name: "प्लस उपनाम", description: "उपयोगकर्ता नाम के बाद +tag जोड़ें।" },
        case: { name: "केस बदलाव", description: "अक्षरों का बड़ा/छोटा रूप बदलें।" },
        domain: { name: "डोमेन बदलाव", description: "gmail.com और googlemail.com के बीच बदलें।" },
      },
    },
    ru: {
      pageTitle: "Генератор алиасов Gmail",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "Язык",
      title: "Генератор алиасов Gmail",
      subtitle: "Массово создавайте алиасы Gmail с точками, +тегами, регистром и сменой домена.",
      inputLabel: "Имя пользователя Gmail",
      inputHint: "Введите только часть до @, например: yourname",
      placeholder: "Введите имя пользователя Gmail",
      rulesTitle: "Правила генерации",
      countTitle: "Количество алиасов",
      resultsTitle: "Сгенерированные алиасы",
      generateButton: "Сгенерировать",
      copyButton: "Скопировать все",
      invalidInput: "Введите корректное имя пользователя Gmail",
      copied: "Скопировано в буфер обмена",
      copyFailed: "Не удалось скопировать, скопируйте вручную",
      partialResult: "Выбранные правила не дают нужного числа уникальных алиасов; показаны все доступные.",
      generatedCount: (actual, requested) => `Сгенерировано ${actual} из ${requested}`,
      countOption: (value) => `${value} алиасов`,
      rules: {
        dot: { name: "Вариант с точками", description: "Добавляет точки в имя пользователя, например a.bc.def." },
        plus: { name: "Вариант с +", description: "Добавляет +tag после имени пользователя." },
        case: { name: "Смена регистра", description: "Меняет регистр букв случайным образом." },
        domain: { name: "Смена домена", description: "Переключает gmail.com и googlemail.com." },
      },
    },
    ja: {
      pageTitle: "Gmail 無限エイリアス生成",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "言語",
      title: "Gmail 無限エイリアス生成",
      subtitle: "ドット、プラス、大小文字、ドメイン差分を使って Gmail エイリアスをまとめて生成します。",
      inputLabel: "Gmail ユーザー名",
      inputHint: "@ より前の部分だけを入力してください。例: yourname",
      placeholder: "Gmail ユーザー名を入力",
      rulesTitle: "生成ルール",
      countTitle: "生成数",
      resultsTitle: "生成結果",
      generateButton: "エイリアスを生成",
      copyButton: "すべてコピー",
      invalidInput: "有効な Gmail ユーザー名を入力してください",
      copied: "クリップボードにコピーしました",
      copyFailed: "コピーに失敗しました。手動でコピーしてください",
      partialResult: "選択したルールでは十分な一意のエイリアスを生成できないため、生成可能な結果のみ表示しています。",
      generatedCount: (actual, requested) => `${requested} 件中 ${actual} 件を生成`,
      countOption: (value) => `${value} 件`,
      rules: {
        dot: { name: "ドット変形", description: "ユーザー名にドットを挿入します。" },
        plus: { name: "プラス別名", description: "ユーザー名の後ろに +tag を追加します。" },
        case: { name: "大小文字変形", description: "文字の大文字・小文字をランダムに変更します。" },
        domain: { name: "ドメイン切替", description: "gmail.com と googlemail.com を切り替えます。" },
      },
    },
    ko: {
      pageTitle: "Gmail 별칭 생성기",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "언어",
      title: "Gmail 별칭 생성기",
      subtitle: "점, 플러스, 대소문자, 도메인 변형으로 Gmail 별칭을 한 번에 생성합니다.",
      inputLabel: "Gmail 사용자 이름",
      inputHint: "@ 앞부분만 입력하세요. 예: yourname",
      placeholder: "Gmail 사용자 이름 입력",
      rulesTitle: "생성 규칙",
      countTitle: "생성 개수",
      resultsTitle: "생성 결과",
      generateButton: "별칭 생성",
      copyButton: "전체 복사",
      invalidInput: "올바른 Gmail 사용자 이름을 입력하세요",
      copied: "클립보드에 복사되었습니다",
      copyFailed: "복사에 실패했습니다. 수동으로 복사해 주세요",
      partialResult: "현재 규칙으로는 충분한 고유 별칭을 만들 수 없어 가능한 결과만 표시했습니다.",
      generatedCount: (actual, requested) => `${requested}개 중 ${actual}개 생성`,
      countOption: (value) => `${value}개`,
      rules: {
        dot: { name: "점 변형", description: "사용자 이름 중간에 점을 넣습니다." },
        plus: { name: "플러스 별칭", description: "사용자 이름 뒤에 +tag를 붙입니다." },
        case: { name: "대소문자 변형", description: "문자의 대소문자를 무작위로 바꿉니다." },
        domain: { name: "도메인 전환", description: "gmail.com과 googlemail.com을 전환합니다." },
      },
    },
    ar: {
      pageTitle: "مولد أسماء Gmail المستعارة",
      eyebrow: "Gmail Alias Toolkit",
      languageLabel: "اللغة",
      title: "مولد أسماء Gmail المستعارة",
      subtitle: "أنشئ أسماء Gmail مستعارة دفعة واحدة باستخدام النقاط و + والاختلاف في حالة الأحرف وتبديل النطاق.",
      inputLabel: "اسم مستخدم Gmail",
      inputHint: "اكتب الجزء الذي يسبق @ فقط، مثل: yourname",
      placeholder: "أدخل اسم مستخدم Gmail",
      rulesTitle: "قواعد التوليد",
      countTitle: "عدد الأسماء",
      resultsTitle: "النتائج",
      generateButton: "توليد الأسماء",
      copyButton: "نسخ الكل",
      invalidInput: "يرجى إدخال اسم مستخدم Gmail صالح",
      copied: "تم النسخ إلى الحافظة",
      copyFailed: "فشل النسخ، انسخ يدويًا",
      partialResult: "القواعد المحددة لا تنتج عددًا كافيًا من الأسماء الفريدة؛ لذلك تم عرض كل النتائج الممكنة.",
      generatedCount: (actual, requested) => `تم إنشاء ${actual} من أصل ${requested}`,
      countOption: (value) => `${value} اسمًا`,
      rules: {
        dot: { name: "تغيير النقاط", description: "إدراج نقاط داخل اسم المستخدم." },
        plus: { name: "اسم +", description: "إضافة +tag بعد اسم المستخدم." },
        case: { name: "تغيير حالة الأحرف", description: "تبديل الحروف بين الكبيرة والصغيرة عشوائيًا." },
        domain: { name: "تبديل النطاق", description: "التبديل بين gmail.com و googlemail.com." },
      },
    },
  };

  const initialRequestedCount = (() => {
    try {
      const savedValue = window.localStorage.getItem(COUNT_STORAGE_KEY);
      const parsed = Number.parseInt(String(savedValue || "").trim(), 10);
      if (Number.isInteger(parsed) && parsed >= MIN_COUNT && parsed <= MAX_COUNT) {
        return parsed;
      }
    } catch (error) {
      // ignore storage read failures
    }

    return DEFAULT_COUNT;
  })();

  const state = {
    language: "zh",
    selectedRules: new Set(ALL_RULES),
    aliases: [],
    currentPage: 1,
    requestedCount: initialRequestedCount,
  };

  const elements = {
    eyebrow: document.getElementById("eyebrow"),
    title: document.getElementById("title"),
    subtitle: document.getElementById("subtitle"),
    languageLabel: document.getElementById("languageLabel"),
    languageSelect: document.getElementById("languageSelect"),
    inputLabel: document.getElementById("inputLabel"),
    inputHint: document.getElementById("inputHint"),
    emailInput: document.getElementById("emailInput"),
    rulesTitle: document.getElementById("rulesTitle"),
    rulesGrid: document.getElementById("rulesGrid"),
    countTitle: document.getElementById("countTitle"),
    countCustomLabel: document.getElementById("countCustomLabel"),
    countInputHint: document.getElementById("countInputHint"),
    countInput: document.getElementById("countInput"),
    generateButton: document.getElementById("generateButton"),
    resultsSection: document.getElementById("resultsSection"),
    resultsTitle: document.getElementById("resultsTitle"),
    resultSummary: document.getElementById("resultSummary"),
    resultsList: document.getElementById("resultsList"),
    pageInfo: document.getElementById("pageInfo"),
    prevPageButton: document.getElementById("prevPageButton"),
    nextPageButton: document.getElementById("nextPageButton"),
    copyButton: document.getElementById("copyButton"),
    toast: document.getElementById("toast"),
  };

  let toastTimer = null;

  function getText() {
    const base = translations.en;
    const current = translations[state.language] || {};
    return {
      ...base,
      ...current,
      rules: {
        ...base.rules,
        ...(current.rules || {}),
      },
    };
  }

  function showToast(message, tone) {
    elements.toast.textContent = message;
    elements.toast.className = `toast visible ${tone || ""}`.trim();

    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
      elements.toast.className = "toast";
    }, 2200);
  }

  function saveRequestedCount(value) {
    try {
      window.localStorage.setItem(COUNT_STORAGE_KEY, String(value));
    } catch (error) {
      // ignore storage write failures
    }
  }

  function getCountStatus(rawValue) {
    const normalized = String(rawValue || "").trim();
    if (normalized === "") {
      return { kind: "empty", value: null };
    }

    const value = Number.parseInt(normalized, 10);
    if (!Number.isInteger(value)) {
      return { kind: "invalid", value: null };
    }

    if (value < MIN_COUNT) {
      return { kind: "tooLow", value };
    }

    if (value > MAX_COUNT) {
      return { kind: "tooHigh", value };
    }

    return { kind: "valid", value };
  }

  function getRequestedCount() {
    const status = getCountStatus(elements.countInput.value);
    return status.kind === "valid" ? status.value : null;
  }

  function getCountErrorMessage(text, countStatus) {
    if (countStatus.kind === "tooHigh") {
      return text.countTooHigh;
    }

    if (countStatus.kind === "tooLow") {
      return text.countTooLow;
    }

    return text.invalidCount;
  }

  function handleCountInputChange() {
    const status = getCountStatus(elements.countInput.value);
    if (status.kind === "valid") {
      state.requestedCount = status.value;
      saveRequestedCount(state.requestedCount);
    }
    validateForm();
  }

  function normalizeCountInput() {
    const text = getText();
    const status = getCountStatus(elements.countInput.value);

    if (status.kind === "tooHigh") {
      state.requestedCount = MAX_COUNT;
      showToast(text.countClampedToMax, "warning");
    } else if (status.kind === "tooLow") {
      state.requestedCount = MIN_COUNT;
      showToast(text.countClampedToMin, "warning");
    } else if (status.kind === "valid") {
      state.requestedCount = status.value;
    }

    elements.countInput.value = String(state.requestedCount);
    saveRequestedCount(state.requestedCount);
    validateForm();
  }

  function renderRules() {
    const text = getText();
    elements.rulesGrid.innerHTML = ALL_RULES.map((ruleId) => {
      const rule = text.rules[ruleId];
      const active = state.selectedRules.has(ruleId);

      return `
        <button
          type="button"
          class="rule-card ${active ? "active" : ""}"
          data-rule-id="${ruleId}"
          aria-pressed="${active}"
        >
          <span class="rule-name">${rule.name}</span>
          <span class="rule-desc">${rule.description}</span>
        </button>
      `;
    }).join("");
  }

  function updateTextContent() {
    const text = getText();

    document.title = text.pageTitle;
    document.documentElement.lang = state.language === "zh" ? "zh-CN" : state.language;
    document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";

    elements.eyebrow.textContent = text.eyebrow;
    elements.languageLabel.textContent = text.languageLabel;
    elements.title.textContent = text.title;
    elements.subtitle.textContent = text.subtitle;
    elements.inputLabel.textContent = text.inputLabel;
    elements.inputHint.textContent = text.inputHint;
    elements.emailInput.placeholder = text.placeholder;
    elements.rulesTitle.textContent = text.rulesTitle;
    elements.countTitle.textContent = text.countTitle;
    elements.countCustomLabel.textContent = text.countCustomLabel;
    elements.countInputHint.textContent = text.countInputHint;
    elements.resultsTitle.textContent = text.resultsTitle;
    elements.generateButton.textContent = text.generateButton;
    elements.copyButton.textContent = text.copyButton;
    elements.prevPageButton.textContent = text.prevPage;
    elements.nextPageButton.textContent = text.nextPage;

    elements.countInput.value = String(state.requestedCount);
    renderRules();
    validateForm();
    renderResults();
  }

  function validateForm() {
    const normalizedUsername = generator.normalizeUsername(elements.emailInput.value);
    const isValidUsername = generator.isValidUsername(normalizedUsername);
    const isValidCount = getCountStatus(elements.countInput.value).kind === "valid";

    elements.generateButton.disabled = !(isValidUsername && isValidCount);
    return isValidUsername && isValidCount;
  }

  async function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (error) {
        // fallback below
      }
    }

    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = value;
    tempTextarea.setAttribute("readonly", "true");
    tempTextarea.style.position = "fixed";
    tempTextarea.style.opacity = "0";
    document.body.appendChild(tempTextarea);
    tempTextarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(tempTextarea);
    return copied;
  }

  function renderResultsPage() {
    const text = getText();
    const totalItems = state.aliases.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    state.currentPage = Math.min(Math.max(1, state.currentPage), totalPages);

    const startIndex = (state.currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
    const pageItems = state.aliases.slice(startIndex, endIndex);

    elements.resultsList.innerHTML = "";

    const fragment = document.createDocumentFragment();
    pageItems.forEach((alias, index) => {
      const item = document.createElement("li");
      item.className = "result-item";

      const row = document.createElement("div");
      row.className = "result-row";

      const code = document.createElement("code");
      code.textContent = `${startIndex + index + 1}. ${alias}`;
      row.appendChild(code);

      const copySingleButton = document.createElement("button");
      copySingleButton.type = "button";
      copySingleButton.className = "result-copy-button";
      copySingleButton.dataset.alias = alias;
      copySingleButton.textContent = text.copySingle;
      row.appendChild(copySingleButton);

      item.appendChild(row);

      fragment.appendChild(item);
    });

    elements.resultsList.appendChild(fragment);
    elements.pageInfo.textContent =
      totalItems > 0
        ? text.pageInfo(state.currentPage, totalPages, startIndex + 1, endIndex, totalItems)
        : "";

    elements.prevPageButton.disabled = state.currentPage <= 1;
    elements.nextPageButton.disabled = state.currentPage >= totalPages;
  }

  function renderResults() {
    if (!state.aliases.length) {
      elements.resultsSection.classList.add("hidden");
      return;
    }

    const text = getText();
    elements.resultsSection.classList.remove("hidden");
    elements.resultSummary.textContent =
      text.generatedCount(state.aliases.length, state.requestedCount) +
      (state.aliases.length < state.requestedCount ? ` · ${text.partialResult}` : "");

    renderResultsPage();
  }

  function handleGenerate() {
    const text = getText();
    const countStatus = getCountStatus(elements.countInput.value);
    const count = countStatus.kind === "valid" ? countStatus.value : null;

    if (!validateForm()) {
      showToast(
        generator.isValidUsername(generator.normalizeUsername(elements.emailInput.value))
          ? getCountErrorMessage(text, countStatus)
          : text.invalidInput,
        "warning"
      );
      return;
    }

    state.requestedCount = count;
    saveRequestedCount(state.requestedCount);
    const enabledRules = Array.from(state.selectedRules);
    const { aliases } = generator.generateAliases({
      username: elements.emailInput.value,
      count,
      enabledRules,
    });

    state.aliases = aliases;
    state.currentPage = 1;
    renderResults();
  }

  function handleRuleToggle(event) {
    const button = event.target.closest("[data-rule-id]");
    if (!button) {
      return;
    }

    const ruleId = button.getAttribute("data-rule-id");
    if (state.selectedRules.has(ruleId)) {
      state.selectedRules.delete(ruleId);
    } else {
      state.selectedRules.add(ruleId);
    }

    renderRules();
  }

  async function handleCopy() {
    const text = getText();
    if (!state.aliases.length) {
      return;
    }

    const copied = await copyText(state.aliases.join("\n"));
    showToast(copied ? text.copied : text.copyFailed, copied ? "success" : "warning");
  }

  async function handleSingleCopy(event) {
    const button = event.target.closest("[data-alias]");
    if (!button) {
      return;
    }

    const text = getText();
    const alias = button.getAttribute("data-alias");
    if (!alias) {
      return;
    }

    const copied = await copyText(alias);
    showToast(copied ? text.singleCopied : text.copyFailed, copied ? "success" : "warning");
  }

  function changePage(nextPage) {
    const totalPages = Math.max(1, Math.ceil(state.aliases.length / PAGE_SIZE));
    state.currentPage = Math.min(Math.max(1, nextPage), totalPages);
    renderResultsPage();
  }

  elements.languageSelect.addEventListener("change", (event) => {
    state.language = event.target.value;
    updateTextContent();
  });

  elements.emailInput.addEventListener("input", validateForm);
  elements.emailInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !elements.generateButton.disabled) {
      handleGenerate();
    }
  });

  elements.countInput.addEventListener("input", handleCountInputChange);
  elements.countInput.addEventListener("blur", normalizeCountInput);
  elements.countInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !elements.generateButton.disabled) {
      normalizeCountInput();
      handleGenerate();
    }
  });

  elements.generateButton.addEventListener("click", handleGenerate);
  elements.copyButton.addEventListener("click", handleCopy);
  elements.resultsList.addEventListener("click", handleSingleCopy);
  elements.rulesGrid.addEventListener("click", handleRuleToggle);
  elements.prevPageButton.addEventListener("click", () => changePage(state.currentPage - 1));
  elements.nextPageButton.addEventListener("click", () => changePage(state.currentPage + 1));

  updateTextContent();
})();
