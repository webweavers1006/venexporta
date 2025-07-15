import logo from '@assets/logo/isologoC.png'

const MoleculesPanel = ({title, subtitle, ...rest}) => {
    return (
        <div className="box pt-0 pb-0 pr-0 pl-0 bg-primary rounded-2xl">
            <section className={`hero is-radius`}>
                <div className="hero-body">
                    <div className="content is-pulled-right">
                    </div>
                    
                    <div className="flex items-center">
                        <figure className="image is-48x48 mr-3">
                            <img className="w-[48px] h-[48px]" src={logo} alt="marca"/>
                        </figure>
                        <div>
                            <h2 className="text-3xl text-gray-200 font-bold dark:text-white">
                                {title}
                            </h2>
                            <p className="subtitle text-gray-300">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MoleculesPanel