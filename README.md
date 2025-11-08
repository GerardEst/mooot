Lligues de wordle en català

### Tasques manuals
Cada final de mès: 
- Preparar els texts de tancament de mes i entrega de premis
- Preparar els nous premis pel mes vinent a conf de back i de front
- Un cop ja s'hagin repartit els premis, esborrar a la base de dades totes les partides de games_chats, 

### Estils mensuals
- Per afegir un estil propi a la cuadrícula cada mes, s'ha de posar dins de game-styles/ amb el nom game-leagueXX.style.ts, on XX és el número de mes.
- monthStyles.ts s'encarrega de carregar tots els mòduls i fer servir el del mes actual dins els estils de MoootJocGame.
- A MootJocGame es carreguen primers els estils globals, després el generic per la base del joc, i finalment els personalitzats de cada mes.