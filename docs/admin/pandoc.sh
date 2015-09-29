#! /bin/bash
for protocol in protocols/*.markdown; do
  pandoc -s -N --template=meeting-minutes-template.latex \
    $protocol -o $protocol.pdf --variable documentclass=article
done
