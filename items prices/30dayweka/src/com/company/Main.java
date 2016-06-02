package com.company;

import weka.classifiers.Classifier;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Main {

    public static void main(String[] args) throws Exception {
        // create attribute list
        ArrayList<Attribute> attrs = new ArrayList<>();
        for (int i = 0; i < 29; ++i) {
            attrs.add(new Attribute("change" + i));
        }
        String[] models = {"rs_price_all_random_tree_depth15", "rs_price_bagging",
                "rs_price_REPT", "rs_price_perceptron",
                "rs_price_all_REPT", "rs_price_random_forest",
                "rs_price_all_bagging", "rs_price_random_tree",
                "rs_price_all_perceptron", "rs_price_random_tree_depth15"};

        for (String model : models) {
            Classifier cfer = (Classifier) weka.core.SerializationHelper.read(model + ".model");

            // load last day of train data
            Stream<String> lines = Files.lines(Paths.get("Crafting materials.csv")).filter(line -> line.matches("^.*?,.*?,1462838400000,.*"));

            List<String> predicted = new ArrayList<>();
            predicted.add("ID,timestamp,price_now,cum_change_type,01change_type,p_change_day0_to_day1,p_change_day1_to_day2,p_change_day2_to_day3,p_change_day3_to_day4,p_change_day4_to_day5,p_change_day5_to_day6,p_change_day6_to_day7,p_change_day7_to_day8,p_change_day8_to_day9,p_change_day9_to_day10,p_change_day10_to_day11,p_change_day11_to_day12,p_change_day12_to_day13,p_change_day13_to_day14,p_change_day14_to_day15,p_change_day15_to_day16,p_change_day16_to_day17,p_change_day17_to_day18,p_change_day18_to_day19,p_change_day19_to_day20,p_change_day20_to_day21,p_change_day21_to_day22,p_change_day22_to_day23,p_change_day23_to_day24,p_change_day24_to_day25,p_change_day25_to_day26,p_change_day26_to_day27,p_change_day27_to_day28,p_change_day28_to_day29");
            predicted.addAll(lines.flatMap(
                    s -> {
                        List<String> predictions = new ArrayList<>();
                        String ID = s.split(",")[0];
                        int price = Integer.parseInt(s.split(",")[3]);
                        int originalPrice = price;
                        long time = Long.parseLong(s.split(",")[2]);
                        // initialize with existing data
                        Object[] points = Arrays.asList(s.split(",")).subList(11, 40).stream().map(Double::parseDouble).toArray();
                        int DAYS = 55;
                        Double[] values = new Double[DAYS];
                        for (int i = 0; i < 29; ++i) {
                            values[DAYS - 29 + i] = (Double) points[i];
                        }
                        for (int i = DAYS - 30; i > -1; --i) {
                            // set up instances object to predict
                            Instances insts = new Instances("intermediate", attrs, 1);
                            insts.setClassIndex(0);
                            // add instance data
                            Instance instance = new DenseInstance(29);
                            for (int j = 1; j < 29; ++j) {
                                instance.setValue(j, values[i + j]);
                            }
                            insts.add(instance);
                            // classify
                            try {
                                double clsLabel = cfer.classifyInstance(insts.instance(0));
                                // round prediction to integer
                                int change = (int) Math.round(price * clsLabel / 100);
                                clsLabel = 100.0d * change / price;
                                insts.instance(0).setClassValue(clsLabel);
                                String changeType = clsLabel == 0 ? "S" : (clsLabel > 0 ? "U" : "D");
                                price += change;
                                String cumChange = price == originalPrice ? "S" : (price > originalPrice ? "U" : "D");
                                time += 86400000;
                                String data = insts.instance(0).toStringMaxDecimalDigits(5);
                                predictions.add(String.join(",", ID, String.valueOf(time), String.valueOf(price), cumChange, changeType, data));

                                values[i] = clsLabel;
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                        return predictions.stream();
                    }).collect(Collectors.toList()));

            Files.write(Paths.get(model + ".csv"), predicted, Charset.defaultCharset());
            System.out.println("Done with model " + model);
        }

    }
}
