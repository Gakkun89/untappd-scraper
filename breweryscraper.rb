# frozen_string_literal: true

require 'nokogiri'
require 'json'
require 'httparty'
require 'open-uri'
require 'pry-byebug'
require 'nordvpn-api'

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
  puts 'Processing URLs'
  json_data.each do |json_pair|
    cleaned_hash[json_pair.first] = if json_pair.last.split('/').last == 'beer'
                                      json_pair.last
                                    else
                                      get_real_url(json_pair.last)
                                    end
  end
  hash_to_json(cleaned_hash, 'cleaned_json')
end


# TODO, add NORDVPN switching every 100 requests.
# Save progress half way through, allow for resume
def get_real_url(url)
  begin
    puts "Getting real URL for: #{url}"
    doc = Nokogiri::HTML(open(url))
  rescue OpenURI::HTTPError
    puts 'Too many requests, waiting 2 min then retrying...'
    sleep(120)
    doc = Nokogiri::HTML(open(url))
  end
  real_url = 'https://untappd.com' + doc.search('.details').search('a').first['href']
  puts "Real URL is: #{real_url}"
  real_url
end

process_brewers_json('brewers.json')
