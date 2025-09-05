const loadLessons = () => {
  fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then((res) => res.json())
    .then((data) => showLevel(data.data));
};

const showLevel = (levels) => {
  const levelContainer = document.querySelector("#levelContainer");
  // levelContainer.innerHTML = "";
  for (let level of levels) {
    const span = document.createElement("span");
    span.innerHTML = `
            <button onclick="loadLevelWord(${level.level_no})" class="btn btn-outline btn-primary">
          <span>
            <img src="./assets/fa-book-open.png" alt="" />
          </span>
          Lesson-${level.level_no}
        </button>

    `;

    levelContainer.appendChild(span);
  }
};

loadLessons();

const loadLevelWord = (id) => {
  document.querySelector("#lessonSelect").classList.add("hidden");
  document.querySelector("#cardSection").classList.remove("hidden");
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => showCard(data.data));
};

const showCard = (cards) => {
  const cardSection = document.querySelector("#cardSection");
  cardSection.innerHTML = "";
  cards.forEach((card) => {
    const span = document.createElement("span");
    span.innerHTML = `
    <div onclick="showModal(${
      card.id
    })" class="bg-white rounded-2xl text-center items-center   flex flex-col p-9 cursor-pointer h-full">
        <p class="text-3xl font-bold">${card.word}</p>
        <p class="text-xl my-6">Meaning/Pronunciation</p>
        <p class="font-semibold">"${
          card.meaning === null ? "সঠিক অর্থ পাওয়া যায়নি!" : card.meaning
        } / ${card.pronunciation}"</p>
        <div class="flex justify-between mt-auto pt-10 w-full">
          <i class="fa-solid fa-circle-info "></i>
          <i class="fa-solid fa-volume-high "></i>
        </div>
      </div>
    `;
    cardSection.appendChild(span);
  });
};

// Modal Section
const showModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then((res) => res.json())
    .then((data) => modalView(data.data));
};

const modalView = (data) => {
  const span = document.createElement("span");
  span.innerHTML = `
    <dialog id="my_modal_2" class="modal bg-white rounded-2xl  p-9">
      <div class="max-w-sm mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200">
  <h2 class="text-xl font-semibold text-gray-800 mb-2">
    ${data.word} <span class="text-lg text-gray-500">(💡: ${
    data.pronunciation
  })</span>
  </h2>

  <div class="mb-4">
    <h3 class="font-bold text-gray-700">Meaning</h3>
    <p class="text-gray-800">${data.meaning}</p>
  </div>

  <div class="mb-4">
    <h3 class="font-bold text-gray-700">Example</h3>
    <p class="text-gray-800">${data.sentence}</p>
  </div>

  <div class="mb-4">
    <h3 class="font-bold text-gray-700">সমার্থক শব্দগুলো</h3>
    <div class="flex flex-wrap gap-2 mt-2">
        ${showSynonym(data.synonyms)}
    </div>
  </div>

  <button onclick="closeModal()" class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
    Complete Learning
  </button>
</div>

    </dialog>
  `;

  document.body.appendChild(span);

  // Get the newly created dialog
  const dialog = span.querySelector("#my_modal_2");

  // Show the modal
  if (dialog) {
    dialog.showModal();
  } else {
    console.error("Dialog element not found");
  }
};

const showSynonym = (synonyms) => {
  return synonyms
    .map(
      (synonym) =>
        `<span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">${synonym}</span>`
    )
    .join(" ");
};

function closeModal() {
  const dialog = document.querySelector("dialog[open]");
  if (dialog) {
    dialog.close();
    dialog.remove(); // Optional: remove from DOM if you want
  }
}

document.querySelector("#searchBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const value = document.querySelector("#search").value.trim().toLowerCase();
  console.log(value);
  document.querySelector("#lessonSelect").classList.add("hidden");
  document.querySelector("#cardSection").classList.remove("hidden");
  fetch(`https://openapi.programming-hero.com/api/words/all`)
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(value)
      );
      showCard(filterWords);
      console.log(filterWords);
    });
});
