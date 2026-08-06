/**
 * BizTalk AI — Frontend Application Logic
 */

// API Base URL (동적 감지: localhost일 경우 8000포트, 배포 환경일 경우 동일 origin)
const getApiBase = () => {
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  
  if (protocol === 'file:' || host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  return window.location.origin;
};

const API_BASE = getApiBase();

// DOM Elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const charCount = document.getElementById("charCount");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const convertBtn = document.getElementById("convertBtn");
const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");
const targetButtons = document.querySelectorAll(".target-btn");
const chipButtons = document.querySelectorAll(".chip-btn");

// App State
let selectedTarget = "boss";
let isLoading = false;

// --------------------------------------------------------------------------
// 1. Target Audience Selection Handler
// --------------------------------------------------------------------------
targetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    targetButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTarget = btn.dataset.target;
  });
});

// --------------------------------------------------------------------------
// 2. Quick Example Chips Handler
// --------------------------------------------------------------------------
chipButtons.forEach((chip) => {
  chip.addEventListener("click", () => {
    const text = chip.dataset.text;
    inputText.value = text;
    updateCharCount();
    inputText.focus();
  });
});

// --------------------------------------------------------------------------
// 3. Input Text Area Events (Char Counter & Clear Button)
// --------------------------------------------------------------------------
function updateCharCount() {
  const currentLength = inputText.value.length;
  charCount.textContent = `${currentLength} / 1000자`;
  
  if (currentLength > 0) {
    clearBtn.style.display = "flex";
  } else {
    clearBtn.style.display = "none";
  }
}

inputText.addEventListener("input", updateCharCount);

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  updateCharCount();
  inputText.focus();
});

// Shortcut Key (Ctrl + Enter or Cmd + Enter)
inputText.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    convertTone();
  }
});

// --------------------------------------------------------------------------
// 4. API Tone Conversion Handler
// --------------------------------------------------------------------------
async function convertTone() {
  if (isLoading) return;

  const text = inputText.value.trim();

  if (!text) {
    showToast("변환할 원문 내용을 입력해주세요.", true);
    inputText.focus();
    return;
  }

  setLoadingState(true);

  try {
    const response = await fetch(`${API_BASE}/api/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        target_audience: selectedTarget,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `서버 오류 (${response.status})`);
    }

    const data = await response.json();
    outputText.value = data.converted_text;
    copyBtn.disabled = false;
    showToast("성공적으로 업무 말투로 변환되었습니다! ✨");

  } catch (error) {
    console.error("Tone conversion failed:", error);
    showToast(`변환 실패: ${error.message || "서버와 통신하지 못했습니다."}`, true);
  } finally {
    setLoadingState(false);
  }
}

convertBtn.addEventListener("click", convertTone);

// --------------------------------------------------------------------------
// 5. Copy Result Handler
// --------------------------------------------------------------------------
copyBtn.addEventListener("click", async () => {
  const textToCopy = outputText.value;
  if (!textToCopy) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast("변환 결과가 클립보드에 복사되었습니다! 📋");
  } catch (err) {
    // Clipboard API Fallback
    outputText.select();
    document.execCommand("copy");
    showToast("변환 결과가 복사되었습니다! 📋");
  }
});

// --------------------------------------------------------------------------
// 6. UI Helpers (Loading State & Toast)
// --------------------------------------------------------------------------
function setLoadingState(loading) {
  isLoading = loading;
  if (loading) {
    loadingOverlay.classList.add("active");
    convertBtn.disabled = true;
    convertBtn.style.opacity = "0.7";
  } else {
    loadingOverlay.classList.remove("active");
    convertBtn.disabled = false;
    convertBtn.style.opacity = "1";
  }
}

let toastTimeout;
function showToast(message, isError = false) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  
  if (isError) {
    toast.classList.add("error");
  } else {
    toast.classList.remove("error");
  }

  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Initial UI setup
updateCharCount();
