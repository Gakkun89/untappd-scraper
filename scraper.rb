# frozen_string_literal: true

require 'nokogiri'
html_file = 'brewDog.html'
doc = Nokogiri::HTML(open(html_file))
p doc.search('.beer-item').first.img
