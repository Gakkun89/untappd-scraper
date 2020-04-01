# frozen_string_literal: true

require 'nokogiri'

results_hash = {}
html_file = 'brewDog.html'

doc = Nokogiri::HTML(open(html_file))
doc.search('.beer-item').each_with_index do |beer_item, i|
  results_hash[i] = {
    name: 'TBD',
    brewery: 'Brewdog',
    abv: 'TBD',
    desc: 'tbd',
    ibu: 'tbd',
    rating: '',
    image: beer_item.search('img').attr('src').value.split("/")[2]
  }
end

p results_hash
