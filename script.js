async function loadGraphData() {
  const response = await fetch("data.json");
  return response.json();
}

async function drawGraph(filter) {
  const data = await loadGraphData();
  const svg = d3.select("#graph"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg.selectAll("*").remove(); // Effacer tout à chaque mise à jour

  if (!filter || filter === "") return; // Ne rien afficher si vide

  // Créer une map pour retrouver les nœuds par nom
  const nodeMap = new Map(data.entités.map((d) => [d.nom, d]));

  // Filtrer les noeuds
  let nodes =
    filter === "all"
      ? data.entités
      : data.entités.filter((d) => d.nom === filter);

  // Si l'utilisateur cherche une entité spécifique, on récupère ses liens associés
  let links = [];
  if (filter !== "all") {
    // Filtrer tous les liens associés à l'entité demandée
    links = data.liens.filter(
      (link) => link.source === filter || link.target === filter
    );
  } else {
    // Si "all", on garde tous les liens
    links = data.liens;
  }

  // Construire le tableau des noeuds associés à ces liens
  const nodesSet = new Set(nodes.map((node) => node.nom));
  links.forEach((link) => {
    nodesSet.add(link.source);
    nodesSet.add(link.target);
  });
  nodes = Array.from(nodesSet).map((nom) => nodeMap.get(nom));

  if (nodes.length === 0) return; // Si aucune entité trouvée, ne rien afficher

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.nom)
        .distance(100)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Ajouter un marqueur pour les flèches
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "black");

  // Créer les liens
  const link = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)");

  // Créer les noeuds
  const node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  node
    .append("circle")
    .attr("r", 10)
    .attr("fill", (d) => d.couleur);

  node
    .append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text((d) => d.nom);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Fonction appelée au clic sur "Afficher"
function updateGraph() {
  const searchTerm = document.getElementById("search").value.trim();
  drawGraph(searchTerm);
}

// Supprime tout au démarrage
document.addEventListener("DOMContentLoaded", () => {
  d3.select("#graph").selectAll("*").remove();
});
