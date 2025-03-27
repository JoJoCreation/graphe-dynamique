// document.addEventListener("DOMContentLoaded", () => {
//   fetch("data.json")
//     .then((response) => response.json())
//     .then((data) => {
//       const container = document.querySelector(".container");
//       const nodes = {};

//       // Positionnement en grille
//       const positions = {
//         A: { x: 300, y: 50 },
//         B1: { x: 200, y: 200 },
//         B2: { x: 400, y: 200 },
//         C11: { x: 100, y: 350 },
//         C12: { x: 250, y: 350 },
//         C21: { x: 350, y: 350 },
//         C22: { x: 500, y: 350 },
//       };

//       // Création des nœuds
//       data.entités.forEach((entité) => {
//         const node = document.createElement("div");
//         node.classList.add("node", entité.couleur);
//         node.textContent = entité.nom;
//         node.style.left = `${positions[entité.nom].x}px`;
//         node.style.top = `${positions[entité.nom].y}px`;
//         container.appendChild(node);
//         nodes[entité.nom] = node;

//         // Animation avec GSAP pour les nœuds (apparition et animation)
//         gsap.fromTo(
//           node,
//           { opacity: 0, scale: 0.5 },
//           { opacity: 1, scale: 1, duration: 1.5, ease: "bounce.out" }
//         );
//       });

//       // Création des liens avec flèches
//       data.liens.forEach((lien) => {
//         const sourceNode = nodes[lien.source];
//         const targetNode = nodes[lien.target];

//         const link = document.createElement("div");
//         link.classList.add("link");
//         container.appendChild(link);

//         // Position des liens
//         const x1 = positions[lien.source].x + 30;
//         const y1 = positions[lien.source].y + 30;
//         const x2 = positions[lien.target].x + 30;
//         const y2 = positions[lien.target].y + 30;

//         const deltaX = x2 - x1;
//         const deltaY = y2 - y1;
//         const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
//         const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

//         link.style.width = `${distance}px`;
//         link.style.transform = `rotate(${angle}deg)`;
//         link.style.left = `${x1}px`;
//         link.style.top = `${y1}px`;

//         // Animation des liens avec GSAP (échelle et opacité)
//         gsap.fromTo(
//           link,
//           { opacity: 0, width: 0 },
//           { opacity: 1, width: distance, duration: 1.5, ease: "power2.inOut" }
//         );
//       });
//     })
//     .catch((error) =>
//       console.error("Erreur lors du chargement du JSON :", error)
//     );
// });
document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".container");
      const nodes = {};

      // Positionnement en grille
      const positions = {
        A: { x: 300, y: 50 },
        B1: { x: 200, y: 200 },
        B2: { x: 400, y: 200 },
        C11: { x: 100, y: 350 },
        C12: { x: 250, y: 350 },
        C21: { x: 350, y: 350 },
        C22: { x: 500, y: 350 },
      };

      // Création des nœuds
      data.entités.forEach((entité) => {
        const node = document.createElement("div");
        node.classList.add("node", entité.couleur);
        node.textContent = entité.nom;
        node.style.left = `${positions[entité.nom].x}px`;
        node.style.top = `${positions[entité.nom].y}px`;
        container.appendChild(node);
        nodes[entité.nom] = node;

        // Animation fluide pour les nœuds (danse)
        gsap.fromTo(
          node,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "bounce.out",
            repeat: -1, // répéter l'animation
            yoyo: true, // aller-retour pour donner un effet de danse
            yoyoEase: "power1.inOut", // créer une transition plus fluide
            rotation: 5, // légères rotations pour l'effet de danse
            stagger: 0.2, // décalage d'animation entre chaque nœud
          }
        );
      });

      // Création des liens avec flèches
      data.liens.forEach((lien) => {
        const sourceNode = nodes[lien.source];
        const targetNode = nodes[lien.target];

        const link = document.createElement("div");
        link.classList.add("link");
        container.appendChild(link);

        // Position des liens
        const x1 = positions[lien.source].x + 30;
        const y1 = positions[lien.source].y + 30;
        const x2 = positions[lien.target].x + 30;
        const y2 = positions[lien.target].y + 30;

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        link.style.width = `${distance}px`;
        link.style.transform = `rotate(${angle}deg)`;
        link.style.left = `${x1}px`;
        link.style.top = `${y1}px`;

        // Animation des liens avec GSAP (échelle et opacité)
        gsap.fromTo(
          link,
          { opacity: 0, width: 0 },
          { opacity: 1, width: distance, duration: 1.5, ease: "power2.inOut" }
        );
      });

      // Effet au clic : Animation des nœuds
      document.querySelectorAll(".node").forEach((node) => {
        node.addEventListener("click", (e) => {
          // Applique une animation d'agrandissement au clic
          gsap.to(e.target, {
            scale: 1.5,
            rotation: 360,
            duration: 1,
            ease: "elastic.out(1, 0.3)",
            onComplete: () => {
              // Remettre à la taille normale après l'animation
              gsap.to(e.target, { scale: 1, rotation: 0, duration: 0.5 });
            },
          });
        });
      });
    })
    .catch((error) =>
      console.error("Erreur lors du chargement du JSON :", error)
    );
});

gsap.fromTo(
  "h1",
  { opacity: 0, y: -50 },
  { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
);
