require 'csv'


confusion = Hash[["all perceptron", "cat perceptron",
                  "all REPTree", "cat REPTree", "cat random forest",
                  "all bagging", "cat bagging", "cat random tree",
                  "all d15 random tree", "cat d15 random tree"].map { |name|
  [name, {"U" => {"U" => 0, "S" => 0, "D" => 0},
          "S" => {"U" => 0, "S" => 0, "D" => 0},
          "D" => {"U" => 0, "S" => 0, "D" => 0}}] }]
actual_change = {}
CSV.foreach("combined.csv", :headers => true) do |row|
  if row["timestamp"] == "1464998400000"
    if row["source"] == "actual"
      actual_change[row["ID"]] = row["cum_change_type"]
    else
      confusion[row["source"]][row["cum_change_type"]][actual_change[row["ID"]]] += 1
    end
  end
end

confusion.each { |k, v| puts k, v }