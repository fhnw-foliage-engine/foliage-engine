
## Grobplanung

\begin{figure}[!htb]
\begin{center}

\begin{ganttchart}[y unit title=0.4cm,
y unit chart=0.5cm,
vgrid,hgrid, 
title label anchor/.style={below=-1.6ex},
title left shift=.05,
title right shift=-.05,
title height=1,
bar/.style={fill=gray!50},
incomplete/.style={fill=white},
progress label text={},
bar height=0.7,
group right shift=0,
group top shift=.6,
group height=.3,
group peaks={}{}{.2}]{20}

%labels
\gantttitle{IP5 - Foliage Engine}{20} \\
\gantttitle{September}{4} 
\gantttitle{October}{4} 
\gantttitle{November}{4} 
\gantttitle{Dezember}{4} 
\gantttitle{Januar}{4} \\

%tasks
\ganttgroup{Documentation}{3}{18}
\ganttnewline
\ganttgroup{Project Week}{12}{12}
\ganttnewline
\ganttgroup{Holiday}{16}{17}
\ganttnewline
\ganttnewline
\ganttbar[progress=100]{Initial Analysis}{3}{4} \\
\ganttnewline
\ganttbar{Billboard - Initial}{5}{8} \\
\ganttmilestone{Milestone-1}{8}
\ganttnewline
\ganttnewline
\ganttbar{Billboard - Finalize}{9}{11} \\
\ganttbar{Octree Optimization}{9}{11} \\
\ganttnewline
\ganttmilestone{Milestone-2}{11}
\ganttnewline
\ganttbar{Dynamic Scene Graph}{12}{15} \\
\ganttmilestone{Milestone-3}{15}
\ganttnewline
\ganttnewline
\ganttbar{Buffer}{18}{18} \\
\ganttmilestone{Final Presentation}{18} \\

%relations 
\ganttlink{elem3}{elem4}
\ganttlink{elem4}{elem5}
\ganttlink{elem5}{elem6}
\ganttlink{elem5}{elem7}
\ganttlink{elem6}{elem8}
\ganttlink{elem7}{elem8}  
\ganttlink{elem8}{elem9}
\ganttlink{elem9}{elem10}
\ganttlink{elem10}{elem11}
\ganttlink{elem11}{elem12}

\end{ganttchart}
\end{center}
\end{figure}


### Milestones

- **Milestone - 1:** Es existiert eine erste Version der Billboard Implementation in der Foliage Engine. Die Implementation ist unter Umständen noch nicht ganz fertig, jedoch mehrheitlich. Nachbesserungen (der Billboard Implementation) sowie eine Analyse der Octtree Implementation sollen bis zur Projektwoche vorgenommen werden.

- **Milstone - 2:** Es existiert eine verbesserte Version der Billboard Implementation, des weitern wurde die Octtree Implementation analysiert. Sofern die Resultate befriedigend sind, kann mit der Analyse der Dynamic Scene Graph Implementation in der Projektwoche gestartet werden.

- **Milestone - 3:** Es existiert eine einfache Implementation eines Dynamic Scene Graph (anhängig vom Projektfortschritt).

- **Final Presentation:** Finale Abgabe / Präsentation.
