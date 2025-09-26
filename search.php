<?php get_header();?>

<section id="primary" class="content-area">
  <main id="main" class="site-main">
    <div class="search-page">
    <div id="searchstax-input-container" class="searchstax-input-container"></div>
    <div id="search-feedback-container" class="search-feedback-container"></div>
    <ilw-columns mode="1x2">
     <div id="searchstax-facets-container" class="searchstax-facets-container"></div>  
    <div>    
          
          <div id="searchstax-results-container" class="searchstax-results-container"></div>
          <div id="searchstax-pagination-container" class="searchstax-pagination-container"></div>
      </div>
       
    </ilw-columns>
      
    
      
      <div class="sitemap__wrapper">
        <h2>Need a place to get started?</h2>
        <?php echo do_shortcode('[custom_menu_shortcode]'); ?>
      </div>
      
    </div>
    
  </main><!-- #main -->
</section><!-- #primary -->

<?php get_footer(); ?>