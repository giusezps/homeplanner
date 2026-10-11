# Casa Rivoli — Home Planner

Prototipo web 3D dell’appartamento ricostruito dalla planimetria quotata. Le unità della scena corrispondono a metri reali e gli elementi modificabili restano separati e identificabili.

## Avvio

```bash
npm install
npm run dev
```

Aprire l’indirizzo indicato da Vite. Il progetto parte in modalità **Modifica**.

## Uso

- **3D / Pianta** cambia la camera di modifica.
- Seleziona pareti, pavimenti, porte o arredi per cambiare colore.
- In **Pianta**, trascina gli arredi; usa il pannello per posizione, rotazione e reset.
- **Esplora** attiva la visita in prima persona: clic per catturare il mouse, `WASD` per muoversi, clic sulle porte, `ESC` per uscire.
- **File** esporta o importa archivi `.home3dproj`, crea un nuovo progetto o ripristina quello iniziale.

Le modifiche vengono salvate localmente dopo le interazioni. Non è richiesto alcun backend.

## Verifica

```bash
npm test -- --run
npm run build
```
