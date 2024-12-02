---
category: CMS > Wordpress
title: Custom Wordpress
date: 2024-11-26
author: Romagny13
---

# Guide Complet : Créer un Custom Theme WordPress

---

## **1. Différentes Approches pour Commencer un Thème**

### **1.1. À partir de zéro**

- **Description** : Commencer un thème totalement personnalisé sans dépendre de bases existantes.
- **Avantages** : Contrôle total sur le design et les fonctionnalités.
- **Inconvénients** : Long et nécessite de bonnes connaissances WordPress.

**Étapes :**

1. Créer un dossier dans `wp-content/themes` avec un nom unique.
2. Ajouter un fichier `style.css` avec les métadonnées du thème :
   ```css
   /*
   Theme Name: Mon Thème
   Author: Votre Nom
   Description: Description de votre thème
   Version: 1.0
   */
   ```
3. Créer un fichier `index.php` (point d'entrée principal).
4. Ajouter d'autres fichiers de base : `functions.php`, `header.php`, `footer.php`, `sidebar.php`.

---

### **1.2. À partir d’un starter theme**

- **Exemples** : [\_Underscores](https://underscores.me/), [Sage](https://roots.io/sage/).
- **Avantages** : Fournit une structure de base et accélère le développement.
- **Inconvénients** : Nécessite une prise en main du starter choisi.

**Étapes :**

1. Télécharger un starter theme.
2. Installer les dépendances (souvent via Composer ou npm pour des frameworks modernes).
3. Personnaliser les fichiers fournis.

---

### **1.3. Avec un framework**

- **Exemples** : [Genesis Framework](https://www.studiopress.com/), [Gantry](https://gantry.org/).
- **Avantages** : Support natif, fonctionnalités avancées.
- **Inconvénients** : Moins flexible si vous voulez un contrôle total.

**Étapes :**

1. Acheter ou télécharger un framework.
2. Suivre la documentation pour créer un sous-thème ou personnaliser.

---

### **1.4. Avec un thème personnalisable**

- **Exemples** : Divi, Astra.
- **Avantages** : Convivial pour les non-développeurs, nombreuses options via des interfaces.
- **Inconvénients** : Moins optimisé et limité dans certaines personnalisations.

---

### **1.5. Avec un child theme**

- **Description** : Étendre les fonctionnalités d’un thème existant.
- **Avantages** : Protéger les modifications lors des mises à jour.
- **Inconvénients** : Dépendant du thème parent.

**Étapes :**

1. Créer un dossier `mon-theme-child` dans `wp-content/themes`.
2. Ajouter un fichier `style.css` :
   ```css
   /*
   Theme Name: Mon Thème Child
   Template: nom-du-theme-parent
   */
   ```
3. Ajouter un fichier `functions.php` pour charger les styles et scripts :
   ```php
   <?php
   function mon_theme_child_enqueue_styles() {
       wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
   }
   add_action('wp_enqueue_scripts', 'mon_theme_child_enqueue_styles');
   ```

---

## **2. Structure de Base d’un Thème**

### **2.1. Pages et Templates**

- `index.php` : Fallback principal.
- `style.css` : Feuille de styles principale.
- `functions.php` : Contient les fonctions personnalisées.
- **Fichiers spécifiques** :
  - `home.php` : Page d'accueil du blog.
  - `single.php` : Affichage d’un article.
  - `page.php` : Affichage des pages.
  - `archive.php` : Liste des articles par catégorie, tag, ou custom type.
  - `404.php` : Page d'erreur.

### **2.2. Template Parts**

- Exemples : `header.php`, `footer.php`, `sidebar.php`.
- Inclure un template part :
  ```php
  get_template_part('header');
  ```

### **2.3. Fonctions Utiles**

- **Enregistrement des menus** :
  ```php
  function mon_theme_register_menus() {
      register_nav_menus(array(
          'menu-principal' => __('Menu Principal'),
      ));
  }
  add_action('init', 'mon_theme_register_menus');
  ```
- **Enregistrement des scripts** :
  ```php
  function mon_theme_enqueue_scripts() {
      wp_enqueue_style('style', get_stylesheet_uri());
      wp_enqueue_script('script', get_template_directory_uri() . '/script.js', array('jquery'), null, true);
  }
  add_action('wp_enqueue_scripts', 'mon_theme_enqueue_scripts');
  ```

---

## **3. Créer un Custom Post Type**

**Exemple : Ajouter un type de contenu "Portfolio"**

```php
function mon_theme_register_post_type() {
    register_post_type('portfolio', array(
        'labels' => array(
            'name' => __('Portfolios'),
            'singular_name' => __('Portfolio')
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
    ));
}
add_action('init', 'mon_theme_register_post_type');
```

---

## **4. Créer un Plugin**

1. Créer un dossier dans `wp-content/plugins`.
2. Ajouter un fichier principal, par exemple `mon-plugin.php` :
   ```php
   <?php
   /*
   Plugin Name: Mon Plugin
   Description: Description du plugin
   Version: 1.0
   Author: Votre Nom
   */
   function mon_plugin_function() {
       echo "Mon plugin fonctionne!";
   }
   add_action('wp_footer', 'mon_plugin_function');
   ```

---

## **5. Créer un Widget**

**Exemple de base :**

```php
class Mon_Widget extends WP_Widget {
    function __construct() {
        parent::__construct('mon_widget', __('Mon Widget'), array('description' => __('Un widget personnalisé')));
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        echo "<h2>" . $instance['titre'] . "</h2>";
        echo $args['after_widget'];
    }

    public function form($instance) {
        $titre = !empty($instance['titre']) ? $instance['titre'] : '';
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('titre')); ?>">Titre :</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('titre')); ?>" name="<?php echo esc_attr($this->get_field_name('titre')); ?>" type="text" value="<?php echo esc_attr($titre); ?>">
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['titre'] = (!empty($new_instance['titre'])) ? strip_tags($new_instance['titre']) : '';
        return $instance;
    }
}

function mon_widget_register() {
    register_widget('Mon_Widget');
}
add_action('widgets_init', 'mon_widget_register');
```

---

## **6. Autres Concepts Importants**

- **Customizer API** : Ajouter des options configurables via le Customizer.
- **Hooks et Filtres** : Actions (`add_action`) et filtres (`add_filter`) pour personnaliser WordPress.
- **Création de Taxonomies** :

  ```php
  function mon_theme_register_taxonomy() {
      register_taxonomy('genre', 'post', array(
          'label' => __('Genre'),
          'rewrite' => array('slug' => 'genre'),
          'hierarchical' => true,
      ));
  }
  add_action('init', 'mon_theme_register_taxonomy');
  ```

- **Internationalisation** : Préparer un thème pour traductions avec `__()` et `_e()`.

---

## **7. Plus**

### **1. Setup du Thème**

Lors de la création d'un thème, il est essentiel de configurer certaines fonctionnalités de base.

#### **1.1. Fichier `functions.php`**

Le fichier `functions.php` sert à configurer le thème. Voici un exemple de base :

```php
<?php
// Configuration initiale du thème
function mon_theme_setup() {
    // Support des balises HTML5
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));

    // Support des images mises en avant
    add_theme_support('post-thumbnails');

    // Support des menus
    register_nav_menus(array(
        'menu-principal' => __('Menu Principal', 'mon-theme'),
        'menu-secondaire' => __('Menu Secondaire', 'mon-theme'),
    ));

    // Support des titres dynamiques
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'mon_theme_setup');

// Charger les styles et scripts
function mon_theme_enqueue_styles() {
    wp_enqueue_style('style', get_stylesheet_uri()); // Style principal
    wp_enqueue_style('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'); // Exemple d'intégration externe
    wp_enqueue_script('main-script', get_template_directory_uri() . '/js/main.js', array('jquery'), null, true); // Script principal
}
add_action('wp_enqueue_scripts', 'mon_theme_enqueue_styles');
```

---

#### **1.2. Feuille de Style CSS**

Dans votre dossier du thème, créez un fichier `style.css`. Ce fichier doit inclure des métadonnées pour être reconnu par WordPress.

```css
/*
Theme Name: Mon Thème
Author: Votre Nom
Description: Description de votre thème personnalisé
Version: 1.0
License: GNU General Public License v2 or later
*/
```

Ajoutez ensuite vos styles pour personnaliser l'apparence.

---

### **2. Les Fonctions Utiles de WordPress**

#### **2.1. Fonctions Globales Courantes**

- **Charger le logo personnalisé** :

  ```php
  add_theme_support('custom-logo');
  ```

  Afficher le logo dans le thème :

  ```php
  if (function_exists('the_custom_logo')) {
      the_custom_logo();
  }
  ```

- **Afficher les menus** :

  ```php
  wp_nav_menu(array(
      'theme_location' => 'menu-principal',
      'menu_class' => 'navbar',
  ));
  ```

- **Afficher les images mises en avant** :

  ```php
  if (has_post_thumbnail()) {
      the_post_thumbnail('full', array('class' => 'img-fluid'));
  }
  ```

- **Pagination des articles** :
  ```php
  the_posts_pagination(array(
      'mid_size' => 2,
      'prev_text' => __('Précédent', 'mon-theme'),
      'next_text' => __('Suivant', 'mon-theme'),
  ));
  ```

#### **2.2. Fonctions pour la Personnalisation**

- **Customizer API** :
  Ajouter une option de couleur :
  ```php
  function mon_theme_customizer($wp_customize) {
      $wp_customize->add_setting('couleur_principale', array(
          'default' => '#0000ff',
          'sanitize_callback' => 'sanitize_hex_color',
      ));
      $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'couleur_principale', array(
          'label' => __('Couleur Principale', 'mon-theme'),
          'section' => 'colors',
      )));
  }
  add_action('customize_register', 'mon_theme_customizer');
  ```

---

### **3. Utilisation de WP_Query**

`WP_Query` est une classe puissante pour récupérer des articles ou tout contenu WordPress.

#### **3.1. Exemple de Base**

Afficher les 5 derniers articles :

```php
<?php
$args = array(
    'post_type' => 'post',
    'posts_per_page' => 5,
);
$ma_query = new WP_Query($args);

if ($ma_query->have_posts()) {
    while ($ma_query->have_posts()) {
        $ma_query->the_post(); ?>
        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
        <p><?php the_excerpt(); ?></p>
    <?php }
    wp_reset_postdata();
} else {
    echo "Aucun article trouvé.";
}
?>
```

#### **3.2. Paramètres Utilisés**

- `post_type` : Type de contenu (`post`, `page`, `custom_post_type`).
- `posts_per_page` : Nombre d’articles à récupérer.
- `orderby` : Ordre des articles (`date`, `title`, `rand`).
- `order` : `ASC` ou `DESC`.
- `category_name` : Nom de la catégorie.

#### **3.3. Pagination avec WP_Query**

```php
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
$args = array(
    'posts_per_page' => 5,
    'paged' => $paged,
);
$ma_query = new WP_Query($args);

if ($ma_query->have_posts()) {
    while ($ma_query->have_posts()) {
        $ma_query->the_post(); ?>
        <h2><?php the_title(); ?></h2>
    <?php }
    echo paginate_links(array(
        'total' => $ma_query->max_num_pages,
    ));
    wp_reset_postdata();
}
```

---

### **4. Setup des Templates**

#### **4.1. Fichiers de Template Principaux**

- `index.php` : Template par défaut.
- `single.php` : Affichage d’un article unique.
- `page.php` : Affichage des pages.
- `archive.php` : Archive des articles ou custom post types.
- `category.php` : Articles par catégorie.
- `404.php` : Page pour les erreurs.

#### **4.2. Template Hierarchy**

WordPress utilise une hiérarchie pour charger les templates.

1. **Page spécifique** : `page-slug.php`
2. **Type d'article spécifique** : `single-{post-type}.php`
3. **Fallback général** : `index.php`

---

### **5. Exemples Pratiques**

#### **5.1. Boucle Personnalisée dans une Page**

Ajouter une boucle pour afficher un type de contenu spécifique sur une page personnalisée :

```php
<?php
/* Template Name: Portfolio */
get_header();

$args = array('post_type' => 'portfolio');
$query = new WP_Query($args);

if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post(); ?>
        <h2><?php the_title(); ?></h2>
        <p><?php the_content(); ?></p>
    <?php }
    wp_reset_postdata();
} else {
    echo "Aucun portfolio trouvé.";
}

get_footer();
?>
```

#### **5.2. Champs Personnalisés avec ACF**

- Installez et activez le plugin ACF.
- Créez un champ personnalisé via l'interface d'ACF.
- Affichez ce champ dans votre thème :
  ```php
  if (function_exists('get_field')) {
      $custom_field = get_field('nom_du_champ');
      echo '<p>' . $custom_field . '</p>';
  }
  ```

---

### **6. Conseils pour un Développement Efficace**

1. **Versionner votre code** : Utilisez Git pour suivre vos modifications.
2. **Testez sur un environnement local** : Outils comme Local WP ou XAMPP.
3. **Optimisez les performances** :
   - Minifiez vos CSS/JS.
   - Utilisez un cache (plugin comme WP Super Cache).
4. **Respectez les standards WordPress** : Consultez le [Handbook WordPress](https://developer.wordpress.org/).

Avec ces éléments, vous êtes bien préparé pour créer un thème WordPress complet et performant ! 🎨

## **8. Ressources Complémentaires**

- [WordPress Codex](https://codex.wordpress.org/)
- [Developer Handbook](https://developer.wordpress.org/)
- [WPBeginner](https://www.wpbeginner.com/)

Avec ces étapes, vous êtes prêt à créer des thèmes, plugins et widgets personnalisés pour WordPress ! 🎉
