#! /bin/bash
for protocol in protocols/*.markdown; do
  pandoc -s -N --template=template-protocols.latex \
    $protocol -o $protocol.pdf \
    --latex-engine=xelatex \
    --variable documentclass=article \
    --variable fontsize=13pt \
    --variable mainfont='Helvetica Neue' \
    --variable sansfont='Helvetica Neue' \
    --variable classoption=openright \
    --variable papersize=a4paper,oneside,headsepline
done

for planning in planning/*.markdown; do
  pandoc -s -N --template=template.latex \
    $planning -o $planning.pdf \
    --latex-engine=xelatex \
    --variable documentclass=article \
    --variable fontsize=13pt \
    --variable mainfont='Helvetica Neue' \
    --variable sansfont='Helvetica Neue' \
    --variable classoption=openright \
    --variable papersize=a4paper,oneside,headsepline
done
