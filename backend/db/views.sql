CREATE VIEW MOVIELIST AS
SELECT
    M.title,
    G.name AS genre_name,
    M.release_date,
    P.watch_status,
    M.certification,
    M.imdb_rating,
    UR.rating AS my_rating
FROM USERPREFERENCES UP
JOIN MOVIES M ON UP.movie_id = M.id
LEFT JOIN MOVIEGENRES MG ON M.id = MG.movie_id
LEFT JOIN GENRES G ON MG.genre_id = G.id
JOIN PREFERENCES P ON UP.preference_id = P.id
LEFT JOIN USERRATINGS UR ON UP.user_rating_id = UR.id;
