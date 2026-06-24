WITH RECURSIVE numbers(n) AS (
    SELECT 1
    UNION ALL
    SELECT n + 1
    FROM numbers
    WHERE n < 1000
)
INSERT INTO payments (
    teacher,
    product,
    paymentType,
    productName,
    productType,
    expiresAt,
    tier,
    student,
    price,
    created_at
)
SELECT
    'user_3DnRVZT8CP5zlmvqC647A3lhwd7',
    CASE abs(random()) % 4
        WHEN 0 THEN 14
        WHEN 1 THEN 32
        WHEN 2 THEN 37
        ELSE 40
    END,
    CASE abs(randon())% 2
        WHEN 0 THEN 'one-time'
        ELSE 'subscription'
    END,
    CASE abs(random()) % 4
        WHEN 0 THEN 'sahil'
        WHEN 1 THEN 'Hemant'
        WHEN 2 THEN 'tanay'
        ELSE 'sanjana'
    END,
    CASE abs(random()) % 4
        WHEN 0 THEN 'courses'
        WHEN 1 THEN 'communities'
        WHEN 2 THEN 'digital'
        ELSE 'digital'
    END,
    datetime(
        'now',
        '+' || (30 + abs(random()) % 365) || ' days'
    ),
    CASE abs(random()) % 3
        WHEN 0 THEN 'Basic'
        WHEN 1 THEN 'Pro'
        WHEN 2 THEN 'Vip'
        ELSE 'Vip'
    END,
    'student_' || n,
    CASE abs(random()) % 4
        WHEN 0 THEN 55
        WHEN 1 THEN 55
        WHEN 2 THEN 55
        ELSE 44
    END,
    datetime(
        'now',
        '-' || (abs(random()) % 365) || ' days',
        '-' || (abs(random()) % 24) || ' hours',
        '-' || (abs(random()) % 60) || ' minutes'
    )
FROM numbers;