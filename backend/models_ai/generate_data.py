import pandas as pd
import numpy as np

np.random.seed(42)

rows = []

for _ in range(15000):

    lens_type = np.random.choice(
        ["Single Vision", "Progressive", "Bifocal"],
        p=[0.55, 0.30, 0.15]
    )

    power = round(
        np.random.uniform(-8, 4),
        2
    )

    lens_index = np.random.choice(
        ["1.50", "1.56", "1.67", "1.74"],
        p=[0.20, 0.30, 0.35, 0.15]
    )

    coating = np.random.choice(
        [
            "Standard",
            "Blue Cut",
            "Photochromic"
        ],
        p=[0.50, 0.30, 0.20]
    )

    store_type = np.random.choice(
        [
            "Retail",
            "Hospital",
            "Franchise"
        ]
    )

    rush_order = np.random.choice(
        [0, 1],
        p=[0.8, 0.2]
    )

    inventory_available = np.random.choice(
        [0, 1],
        p=[0.4, 0.6]
    )

    queue_depth = np.random.randint(
        0,
        40
    )

    machine_load = np.random.randint(
        10,
        100
    )

    utilization_percent = np.random.randint(
        20,
        100
    )

    qc_failures = np.random.randint(
        0,
        5
    )

    completion_hours = (
        24
        + queue_depth * 3.5
        + machine_load * 0.6
        + qc_failures * 12
        + (100 - inventory_available * 100) * 0.8
        - rush_order * 8
    )

    if lens_type == "Progressive":
        completion_hours += 15

    if lens_type == "Bifocal":
        completion_hours += 8

    if coating == "Photochromic":
        completion_hours += 10

    if lens_index == "1.74":
        completion_hours += 12

    completion_hours += np.random.normal(
        0,
        5
    )

    rows.append([
        lens_type,
        power,
        lens_index,
        coating,
        store_type,
        rush_order,
        inventory_available,
        queue_depth,
        machine_load,
        utilization_percent,
        qc_failures,
        round(completion_hours, 2)
    ])

df = pd.DataFrame(
    rows,
    columns=[
        "lens_type",
        "power",
        "lens_index",
        "coating",
        "store_type",
        "rush_order",
        "inventory_available",
        "queue_depth",
        "machine_load",
        "utilization_percent",
        "qc_failures",
        "completion_hours"
    ]
)

df.to_csv(
    "operations_dataset.csv",
    index=False
)

print(df.head())
print("Dataset Generated Successfully")