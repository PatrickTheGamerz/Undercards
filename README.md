<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Undertale Card Game</title>
  <style>
    body {
      background: black;
      font-family: 'Courier New', monospace;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .card-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .card {
      background: #111;
      border: 4px solid white;
      border-radius: 12px;
      padding: 15px;
      width: 180px;
      text-align: center;
      box-shadow: 0 0 10px white;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
      position: relative;
    }

    .card:hover {
      transform: rotateY(10deg) scale(1.05);
      box-shadow: 0 0 25px #ff0000;
      border-color: #ff0000;
    }

    .card img {
      width: 100px;
      height: 100px;
      image-rendering: pixelated;
      border: 2px solid #fff;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .card-title {
      font-size: 18px;
      text-transform: uppercase;
      font-weight: bold;
    }

    .card-desc {
      font-size: 14px;
      margin-top: 5px;
      color: #ccc;
    }

    /* Game-like stats area */
    .card-stats {
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      font-size: 14px;
    }

    .stat {
      background: #222;
      padding: 5px 8px;
      border-radius: 6px;
      border: 1px solid #555;
    }

    /* Rarity colors */
    .rare { border-color: gold; box-shadow: 0 0 15px gold; }
    .epic { border-color: purple; box-shadow: 0 0 15px purple; }
    .common { border-color: gray; }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="card rare">
      <img src="https://placekitten.com/100/100" alt="Character">
      <div class="card-title">Sans</div>
      <div class="card-desc">Lazy skeleton with bad puns.</div>
      <div class="card-stats">
        <div class="stat">ATK: 5</div>
        <div class="stat">DEF: 3</div>
      </div>
    </div>

    <div class="card epic">
      <img src="https://placebear.com/100/100" alt="Character">
      <div class="card-title">Papyrus</div>
      <div class="card-desc">Energetic skeleton who loves spaghetti.</div>
      <div class="card-stats">
        <div class="stat">ATK: 7</div>
        <div class="stat">DEF: 6</div>
      </div>
    </div>

    <div class="card common">
      <img src="https://placebeard.it/100x100" alt="Character">
      <div class="card-title">Flowey</div>
      <div class="card-desc">A flower with a sinister smile.</div>
      <div class="card-stats">
        <div class="stat">ATK: 4</div>
        <div class="stat">DEF: 2</div>
      </div>
    </div>
  </div>
</body>
</html>
