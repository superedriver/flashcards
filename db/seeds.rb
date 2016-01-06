# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require "open-uri"

page = Nokogiri::HTML(open("http://www.lesson1.ru/vocabulary/lexicographer/food.html"))

trs = page.css("table.tbl3 tr:not(.first)")

trs.each do |tr|
  tds = tr.css("td")
  Card.create( original_text: tds[0].content, translated_text: tds[1].content )
end
