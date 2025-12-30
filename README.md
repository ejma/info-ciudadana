Aplicación web que permite el acceso y consulta rápida a información pública por ley para el ciudadano español, pero que normalmente se encuentra en distintas webs oficiales y resulta complejo de consultar y seguir.

A futuro se plantea también como una aplicación para Android.

Los usuarios tendrán distintas utilidades que le ayudarán a llevar su participación política ciudadana de una forma más fácil.

Está enfocada a España a nivel nacional y a las comunidades autónomas. Se nutrirá de fuentes oficiales como el BOE y boletines de las autonomías, la agenda del gobierno, el portal de transparencia nacional, etc.

Funcionalidades:

1. Agenda del gobierno
   Extrae la información de la agenda del gobierno scrapeando la web de la moncloa (https://www.lamoncloa.gob.es/gobierno/agenda/Paginas/agenda.aspx) y la guarda en base de datos, permitiendo al usuario consultar el día que quiera y ver el histórico de un miembro concreto del gobierno.

   Se actualiza incorporando a la base de datos la nueva info de cada día.

2. Acceso a actas completas y resúmenes de las sesiones de parlamento y senado.

3. Análisis de legislaturas (actual y anteriores)
   Permite ver:
      - Promesas electorales para la legislatura (promesas cumplidas, promesas incumplidas/pendientes)
      - Leyes aprobadas o no durante las mismas (indicando los votos de cada partido a cada ley/propuesta y otros datos de interés).

4. Info de subvenciones
   Extrae la info desde el json disponible para descargar aquí: https://www.infosubvenciones.es/bdnstrans/GE/es/inicio, mostrando la info de forma amigable y permitiendo al usuario filtrar, buscar y reordenar.

5. Info de contratación pública

6. Buscador de legislación sobre un tema concreto que busque el usuario.

7. Avisos de subvenciones, leyes, ofertas y contratos públicos dentro de lo que el usuario haya configurado de su interés

8. Seguimiento de la evolución de casos de corrupción e histórico.

9. Apartado informativo sobre las vías de participación ciudadana a nivel nacional y autonómico.


// Se trata de un proyecto en construcción que puede ir variando en su enfoque y funcionalidades, cuyo objetivo es facilitar la participación ciudadana en el proceso legislativo y la transparencia de los gobiernos.

## Cómo ejecutar el proyecto

Para instrucciones detalladas sobre cómo compilar y lanzar el proyecto (backend y frontend), por favor consulta el archivo [RUNNING.md](./RUNNING.md).