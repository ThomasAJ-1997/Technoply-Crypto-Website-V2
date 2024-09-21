const coinList = document.getElementById("coins-listID");
const exchangeList = document.getElementById("exchanges-listID");
const nftList = document.getElementById("nfts-listID");

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");

  if (query) {
    fetchSearchResult(query, [coinList, exchangeList, nftList]);
  } else {
    const searchHeading = document.getElementById("searchHeadingID");
    const searchContainer = document.querySelector(".search-container");
    searchContainer.innerHTML =
      '<p class="red-text" style="color: red; text-align: center; margin-bottom: 8px"></p>';

    searchHeading.innerHTML = `Please search something...`;
  }
});

function fetchSearchResult(param, idsToToggle) {
  const searchHeading = document.getElementById("searchHeadingID");
  idsToToggle.forEach((id) => {
    const errorElement = document.getElementById(`${id}-error`);

    if (errorElement) {
      errorElement.style.display = "none";
    }
    toggleSpinner(id, `${id}-spinner`, true);
  });

  coinList.innerHTML = ``;
  exchangeList.innerHTML = ``;
  nftList.innerHTML = ``;

  searchHeading.innerText = `Search results for ${param}`;

  const url = `https://api.coingecko.com/api/v3/search?query=${param}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Network response was unsuccesful" + response.statusText
        );
      }
      idsToToggle.forEach((id) => toggleSpinner(id, `${id}-spinner`, false));
      return response.json();
    })
    .then((data) => {
      let coins = (data.coins || []).filter(
        (coin) => coin.thumb !== "missing_thumb.png"
      );
      let exchanges = (data.exchanges || []).filter(
        (ex) => ex.thumb !== "missing_thumb.png"
      );
      let nfts = (data.nfts || []).filter(
        (nf) => nf.thumb !== "missing_thumb.png"
      );

      const coinsCount = coins.length;
      const exchangesCount = exchanges.length;
      const nftsCount = nfts.length;

      let minCount = Math.min(coinsCount, exchangesCount, nftsCount);

      if (coinsCount > 0 && exchangesCount > 0 && nftsCount > 0) {
        coins = coins.slice(0, minCount);
        exchanges = exchanges.slice(0, minCount);
        nfts = nfts.slice(0, minCount);
      }

      coinsResults(coins);
      exchangesResults(exchanges);
      nftsResults(nfts);

      if (coins.length === 0) {
        coinList.innerHTML = `<p style="color: red; text-align: center;">No results found for coins.</p>`;
      }

      if (exchanges.length === 0) {
        exchangeList.innerHTML = `<p style="color: red; text-align: center;">No results found for coins.</p>`;
      }

      if (nfts.length === 0) {
        nftList.innerHTML = `<p style="color: red; text-align: center;">No results found for coins.</p>`;
      }
    })
    .catch((error) => {
      idsToToggle.forEach((id) => {
        toggleSpinner(id, `${id}-spinner`, false);
        document.getElementById(`${id}-error`).style.display = `block`;
      });
      console.error("Error fetching data:", error);
    });
}

function coinsResults(coins) {
  coinList.innerHTML = ``;
  const table = createTable(["Rank", "Coin"]);

  coins.forEach((coin) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${coin.market_cap_rank}</td>
    <td class="name-column">
    <img src="${coin.thumb}" alt="${coin.name}" />
    <span>(${coin.symbol})</span>
    </td>
    `;
    table.appendChild(row);
    // row.onclick = () => {
    //   window.location.href = `../../pages/coin.html?coin=${coin.id}`;
    // };
  });
  coinList.appendChild(table);
}

function exchangesResults(exchanges) {
  exchangeList.innerHTML = ``;
  const table = createTable(["Exchange", "Market"]);

  exchanges.forEach((ex) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="name-column">
    <img src="${ex.thumb}" alt="${ex.name}" />${ex.name}</td>
    <td>${ex.market_type}</td>
      `;

    console.log(ex.market_type);

    table.appendChild(row);
  });
  exchangeList.appendChild(table);
}

function nftsResults(nfts) {
  nftList.innerHTML = ``;
  const table = createTable(["NFT", "Symbol"]);

  nfts.forEach((nf) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="name-column">
      <img src="${nf.thumb}" alt="${nf.name}" />${nf.name}</td>
      <td class="name-column">${nf.symbol}</td>
        `;

    table.appendChild(row);
  });
  nftList.appendChild(table);
}
