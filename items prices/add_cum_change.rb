require 'csv'

init_hash = {}
start_hash = {}

CSV.open("by_category_with_percent_change_at_5-5-2016_12-15/Crafting mats.csv", "w",
         :headers => ["ID","timestamp","price_now","01change_type","p_change_day0_to_day1","p_change_day1_to_day2","p_change_day2_to_day3","p_change_day3_to_day4","p_change_day4_to_day5","p_change_day5_to_day6","p_change_day6_to_day7","p_change_day7_to_day8","p_change_day8_to_day9","p_change_day9_to_day10","p_change_day10_to_day11","p_change_day11_to_day12","p_change_day12_to_day13","p_change_day13_to_day14","p_change_day14_to_day15","p_change_day15_to_day16","p_change_day16_to_day17","p_change_day17_to_day18","p_change_day18_to_day19","p_change_day19_to_day20","p_change_day20_to_day21","p_change_day21_to_day22","p_change_day22_to_day23","p_change_day23_to_day24","p_change_day24_to_day25","p_change_day25_to_day26","p_change_day26_to_day27","p_change_day27_to_day28","p_change_day28_to_day29","cum_change_type"],
         :write_headers => true) do |out|
    CSV.foreach("by_category_with_percent_change_at_5-5-2016_12-15/Crafting materials.csv", :headers => true) do |row|
        price_now = Integer(row["price_now"])
        if row["timestamp"] == "1462838400000"
            init_hash[row["ID"]] = price_now
            start_hash[row["ID"]] = true
            elsif start_hash[row["ID"]]
            row["change_cum"] = price_now == init_hash[row["ID"]] ? "S" : (price_now > init_hash[row["ID"]] ? "U" : "D")
            out << row
        end
    end
end