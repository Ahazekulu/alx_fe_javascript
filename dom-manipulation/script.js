const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

const API_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.body, category: "Server" }));
        mergeQuotes(serverQuotes);
        console.log("Quotes synced with server!");
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });
        const data = await response.json();
        console.log("Quote posted successfully:", data);
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

function mergeQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const mergedQuotes = [...new Map([...localQuotes, ...serverQuotes].map(q => [q.text, q])).values()];
    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    quotes.length = 0;
    quotes.push(...mergedQuotes);
    populateCategories();
    showRandomQuote(); // Ensure random quote is shown after merging
}

function syncQuotes() {
    setInterval(fetchQuotesFromServer, 60000);
}

function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteButton">Add Quote</button>
    `;
    document.body.appendChild(formContainer);
    document.getElementById("addQuoteButton").addEventListener("click", addQuote);
}

function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (quoteText === "" || quoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    postQuoteToServer(newQuote);
    showRandomQuote();
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}

function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected category
    const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

function filterQuotes() {
    const category = document.getElementById("categoryFilter").value;
    const filteredQuotes = quotes.filter(q => q.category === category || category === "");
    const quoteDisplay = document.getElementById("quoteDisplay");

    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    } else {
        quoteDisplay.textContent = "No quotes found for this category.";
    }

    // Save the selected category to local storage
    localStorage.setItem("lastSelectedCategory", category);
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", '<select id="categoryFilter" onchange="filterQuotes()"></select>');
    document.body.insertAdjacentHTML("beforeend", '<div id="quoteDisplay"></div>');
    document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
    document.getElementById("importQuotes").addEventListener("change", importFromJsonFile);
    document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    createAddQuoteForm();
    populateCategories();
    showRandomQuote(); // Show a random quote when page loads
    syncQuotes();
});

function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
        const importedQuotes = JSON.parse(reader.result);
        mergeQuotes(importedQuotes);
    };
    reader.readAsText(file);
}
