-- view to get mylist
CREATE VIEW MOVIELIST AS
SELECT
    UP.user_id,
    UP.movie_id,
    UP.created_at,

    M.title,
    M.director,
    M.cast,
    M.imdb_id,
    M.original_language,
    M.overview,
    M.release_date,
    M.imdb_rating,
    M.rotten_rating,
    M.metacritic_rating,
    M.poster_url,
    M.backdrop_url,
    M.trailer_url,
    M.run_time,
    M.certification,

    G.name AS genre_name,
    G.id AS genre_id,

    WP.id AS watchprovider_id,
    WP.provider_name AS watchprovider_name,
    WP.logo_path AS watchprovider_logo_path,
    WP.display_priority AS watchprovider_priority,

    P.is_liked,
    P.watch_status,

    UR.rating AS my_rating,
    UR.review AS my_review
FROM USERPREFERENCES UP
JOIN MOVIES M ON UP.movie_id = M.id
LEFT JOIN MOVIEGENRES MG ON M.id = MG.movie_id
LEFT JOIN GENRES G ON MG.genre_id = G.id
LEFT JOIN MOVIEPROVIDERS MP ON M.id = MP.movie_id
LEFT JOIN WATCHPROVIDERS WP ON MP.provider_id = WP.id
JOIN PREFERENCES P ON UP.preference_id = P.id
LEFT JOIN USERRATINGS UR ON UP.user_rating_id = UR.id;


-- view to get all users and all their data
CREATE VIEW USERLIST AS
SELECT
    U.id AS user_id,
    U.user_name,
    U.first_name,
    U.last_name,
    U.role,
    U.registration_date,
    U.last_login,
    U.profile_picture_url,

    S.theme,
    S.user_vector,

    LS.last_seen,
    LS.ip_address
FROM USERS U
LEFT JOIN USERSETTINGS S ON U.id = S.user_id
LEFT JOIN (
    SELECT s1.user_id, s1.last_seen, s1.ip_address
    FROM SESSIONS s1
    INNER JOIN (
        SELECT user_id, MAX(last_seen) AS max_last_seen
        FROM SESSIONS
        WHERE user_id IS NOT NULL
        GROUP BY user_id
    ) s2 ON s1.user_id = s2.user_id AND s1.last_seen = s2.max_last_seen
) LS ON U.id = LS.user_id;

