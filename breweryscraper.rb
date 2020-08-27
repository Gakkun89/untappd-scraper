# frozen_string_literal: true

require 'nokogiri'
require 'json'
require 'httparty'
require 'pry-byebug'

def brewer_html_to_hash(html_file_location)
  results_hash = {}
  doc = Nokogiri::HTML(open(html_file_location))
  doc.search('.beer-item').each_with_index do |beer_item, i|
    results_hash[i] = 'https://untappd.com' + beer_item.search('a').last['href']
  end
  results_hash
end

def hash_to_json(hash, file_name)
  json = JSON.pretty_generate(hash)
  File.open(file_name + '.json', 'w') do |f|
    f.write(json)
  end
end

def process_brewers_json(json_file_path)
  file = File.open(json_file_path)
  json_data = JSON.load(file)
  cleaned_hash = {}
  json_data.each do |json_pair|
    if json_pair.last.split('/').last == 'beer'
      cleaned_hash[json_pair.first] == json_pair.last
    else
      get_real_url(json_pair)
    end
  end
  cleaned_hash
end

def get_real_url(url_and_index_array)
  index = url_and_index_array.first
  url = url_and_index_array.last
end

process_brewers_json('brewers.json')
