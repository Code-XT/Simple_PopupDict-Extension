document.addEventListener("mouseup", function (event) {
  let selection = window.getSelection().toString();
  let isPopupVisible = false;

  const getMeaning = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meaning");
      }

      const data = await response.json();
      const meaning = data[0]?.meanings[0]?.definitions[0];

      return meaning || "Meaning not found";
    } catch (error) {
      return "Failed to fetch meaning";
    }
  };

  const showMeaning = () => {
    if (
      selection &&
      selection.length > 0 &&
      selection !== " " &&
      !isPopupVisible
    ) {
      getMeaning(selection).then((meaning) => {
        // Create the popup element
        const popup = document.createElement("div");
        popup.textContent = `${selection}: ${meaning?.definition} \n ${
          meaning?.example ? "Example: " + meaning?.example : ""
        }`;
        popup.style.position = "absolute";
        popup.style.maxWidth = "200px";
        popup.style.padding = "10px";
        popup.style.backgroundColor = "#fff";
        popup.style.color = "#333";
        popup.style.border = "1px solid #ccc";
        popup.style.borderRadius = "5px";
        popup.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
        popup.style.zIndex = "9999";
        isPopupVisible = true;

        // Calculate the position of the popup
        const rect = window
          .getSelection()
          .getRangeAt(0)
          .getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft =
          window.pageXOffset || document.documentElement.scrollLeft;
        const top = rect.top + scrollTop - popup.offsetHeight - 10;
        const left =
          rect.left + scrollLeft + (rect.width - popup.offsetWidth) / 2;

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;

        document.body.appendChild(popup);

        popup.addEventListener("click", () => {
          isPopupVisible = false;
          popup.remove();
        });

        setTimeout(() => {
          popup.remove();
        }, 5000);
      });
    }
  };

  const handleKeydown = (event) => {
    if (event.key === "d" || event.key === "D") {
      event.preventDefault();
      showMeaning();
    }
  };

  document.addEventListener("keydown", handleKeydown);
});
