# frozen_string_literal: true

require 'nokogiri'
require 'json'

results_hash = {}
html_file = 'brewDog.html'

doc = Nokogiri::HTML(open(html_file))
doc.search('.beer-item').each_with_index do |beer_item, i|
  results_hash[i] = {
    name: beer_item.search('.name a').text,
    brewery: 'Brewdog',
    style: beer_item.search('.style').text,
    abv: beer_item.search('.abv').text.gsub(/\n/, '').strip,
    desc: beer_item.search('.desc')[1].text.gsub('Read Less', ''),
    ibu: beer_item.search('.ibu').text.gsub(/\n/, '').strip,
    rating: beer_item.search('.num').text.gsub(/[()]/, ''),
    image: beer_item.search('img').attr('src').value.split('/')[-1]
  }
end
beers_json = JSON.pretty_generate(results_hash)

File.open('beers.json', 'w') do |f|
  f.write(beers_json)
end
