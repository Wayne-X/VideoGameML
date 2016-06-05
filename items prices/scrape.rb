require 'net/http'
require 'json'

def cat_url (i)
    "http://services.runescape.com/m=itemdb_rs/api/graph/#{i}.json"
end

def get_retry(url)
    res = ""
    while (res.length == 0) do
        res = Net::HTTP.get(URI(url)).force_encoding('ISO-8859-1')
        sleep(1)
    end
    return res
end
    
IDArray = File.read("IDlist.txt").split(",").map(&:strip)
len = IDArray.length
k = 0
# item_db = IDArray.slice(0...3).flat_map do |i|
item_db = IDArray.map do |i|
    begin
        obj = JSON.parse(get_retry(cat_url(i)))
        puts "got #{k} of #{len}"
        k+=1
        {"ID" => Integer(i), "data" => obj["daily"].map{|k,v| [Integer(k),v]}}
    rescue
        puts "failed #{k} of #{len}"
        {"ID" => Integer(i), "data" => "failed"}
    end
end

filename = "itemdata_at_" + Time.now.strftime("%d-%m-%Y_%H-%M") + ".json"
File.write(filename, JSON.fast_generate({"all" => item_db}))

# item_db = IDArray.flat_map do |i|
#     puts "itemID #{i}:"
#     JSON.parse(get_retry(cat_url(i)))['alpha'].flat_map do |d|
#         letter = cat_alpha_to_str(d['letter'])
#         pages = (d['items'] / 12.0).ceil
#         puts "  Letter #{letter}:"
#         (1..pages).flat_map do |p|
#             JSON.parse(get_retry(cat_page_url(i,letter,p)))['items'].map do |itm|
#                 itm.select{|k,v| ['description','id','members','name','type'].include?(k)}
#             end
#         end
#     end
# end
    