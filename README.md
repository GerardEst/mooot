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

### Premis

### TODO - Coleccionables - Per definir
A la qüadrícula, cada dia, apareixeran algunes caselles aleatories marcades d'alguna manera. Posar una lletra verda sobre la casella marcada farà que es descobreixi un coleccionable que serà algo referent a la lliga actual.
#### Caselles amb coleccionable
- A tothom li ha d'apareixer les mateixes caselles marcades. Crec que es podrien marcar 1, 2 o 3, a llocs completament random però iguals per tothom.
- Segurament hi ha algun número de coleccionables óptim perquè sigui possible aconseguir-los tots, però complicat de fer 100% si no jugues cada dia. Com que no tinc ni idea de com calcular-ho, ho faré a ull: Cada dia n'hauries d'aconseguir 1 o 0, alguns dies 2. Pose'm-hi que 7 dies fas 2, 14 dies 1 i 7 dies cap, son 28 coleccionables que has "obert"
- Em sorgeix un dubte, tothom aconsegueix el mateix coleccionable dins d'una casella? És més, perquè tothom hauria de tenir les mateixes caselles? No donaria més joc que fossin a diferents i que si algú els vol tenir tots però la casella està a baix de tot hagi de perdre punts i un altre no? Crec que m'agraden les dues opcions, aleatori per tothom i tothom igual. Aleatori per tothom faria que es pogués comentar ooh esque jo tenia el coleccionable aquí i clar. Fixe seria, ooh avui era fàcil el coleccionable, o avui impossible.
    - Perquè siguin iguals per tothom, s'ha de basar en el mateix seed. El seed podria ser la paraula del dia, em sembla bastant guai.
    La idea seria convertir la paraula del dia en una matriu de 0, i aleatoriament amb altres números que seràn el coleccionable. 